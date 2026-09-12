import { Slot } from '../models/Slot.js';
import { ProcurementBooking } from '../models/ProcurementBooking.js';
import { Centre } from '../models/Centre.js';
import { sendSMS } from '../services/smsService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { centreId, date } = req.query;
    if (!centreId) {
      return sendError(res, 'centreId query param is required', 'MISSING_PARAM', 400);
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    let slots = await Slot.find({ centreId, date: targetDate, isActive: true }).sort({ startTime: 1 });

    // Auto-create standard slots if none exist for this centre and date
    if (!slots || slots.length === 0) {
      const defaultWindows = [
        { startTime: '08:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '12:00', endTime: '14:00' },
        { startTime: '14:00', endTime: '16:00' },
      ];

      const toCreate = defaultWindows.map((w) => ({
        centreId,
        date: targetDate,
        startTime: w.startTime,
        endTime: w.endTime,
        timeWindow: `${w.startTime} - ${w.endTime}`,
        maxCapacityQuintals: 200,
        bookedCapacityQuintals: 0,
        maxFarmers: 5,
        bookedFarmers: 0,
        isActive: true,
      }));

      slots = await Slot.insertMany(toCreate);
    }

    return sendSuccess(res, 'Available slots retrieved', { slots, count: slots.length });
  } catch (err) {
    next(err);
  }
};

export const bookSlot = async (req, res, next) => {
  try {
    const { slotId, cropType, estimatedQuantityQuintals } = req.body;
    const farmerId = req.user._id;

    if (!slotId || !cropType || !estimatedQuantityQuintals) {
      return sendError(res, 'slotId, cropType, and estimatedQuantityQuintals are required', 'MISSING_FIELDS', 400);
    }

    const slot = await Slot.findById(slotId).populate('centreId');
    if (!slot || !slot.isActive) {
      return sendError(res, 'Target slot is invalid or inactive', 'INVALID_SLOT', 400);
    }

    const maxCap = slot.maxFarmers || 5;
    if ((slot.bookedFarmers || 0) >= maxCap) {
      return sendError(
        res,
        `This time slot is fully booked (${slot.bookedFarmers}/${maxCap}). No more bookings are allowed in this time window.`,
        'SLOT_FULL',
        400
      );
    }

    // Check duplicate active booking for same date
    const existing = await ProcurementBooking.findOne({
      farmerId,
      bookingDate: slot.date,
      status: { $in: ['booked', 'checked_in', 'in_inspection'] },
    });
    if (existing) {
      return sendError(res, `You already have an active slot booking for date ${slot.date}`, 'DUPLICATE_BOOKING', 400);
    }

    // Generate Token Number
    const countToday = await ProcurementBooking.countDocuments({
      centreId: slot.centreId._id,
      bookingDate: slot.date,
    });
    const seq = String(countToday + 1).padStart(3, '0');
    const dateFormatted = slot.date.replace(/-/g, '');
    const tokenNumber = `TOK-${slot.centreId.code}-${dateFormatted}-${seq}`;

    const booking = await ProcurementBooking.create({
      tokenNumber,
      farmerId,
      centreId: slot.centreId._id,
      slotId: slot._id,
      bookingDate: slot.date,
      cropType,
      estimatedQuantityQuintals: Number(estimatedQuantityQuintals),
      status: 'booked',
    });

    // Increment slot metrics
    slot.bookedFarmers += 1;
    slot.bookedCapacityQuintals += Number(estimatedQuantityQuintals);
    await slot.save();

    // Trigger SMS dispatch
    await sendSMS({
      toPhone: req.user.phone,
      lang: req.user.preferredLanguage || 'hi',
      templateKey: 'booking_confirmation',
      templateData: {
        tokenNumber,
        centreName: slot.centreId.name,
        date: slot.date,
        timeSlot: `${slot.startTime} - ${slot.endTime}`,
        cropType,
      },
      userId: farmerId,
    });

    return sendSuccess(res, 'Procurement slot booked successfully', { booking }, 201);
  } catch (err) {
    next(err);
  }
};

export const createBatchSlots = async (req, res, next) => {
  try {
    const { centreId, date, timeSlots, maxCapacityQuintals, maxFarmers } = req.body;
    if (!centreId || !date) {
      return sendError(res, 'centreId and date are required', 'MISSING_FIELDS', 400);
    }

    const defaultWindows = [
      { startTime: '08:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '12:00' },
      { startTime: '12:00', endTime: '14:00' },
      { startTime: '14:00', endTime: '16:00' },
    ];

    const slotsToCreate = (timeSlots || defaultWindows).map((ts) => ({
      centreId,
      date,
      startTime: ts.startTime,
      endTime: ts.endTime,
      timeWindow: `${ts.startTime} - ${ts.endTime}`,
      maxCapacityQuintals: maxCapacityQuintals || 200,
      maxFarmers: maxFarmers || 5,
    }));

    const created = await Slot.insertMany(slotsToCreate);
    return sendSuccess(res, 'Batch time slots created successfully', { slots: created, count: created.length }, 201);
  } catch (err) {
    next(err);
  }
};
