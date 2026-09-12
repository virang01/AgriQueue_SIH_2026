import { ProcurementRecord } from '../models/ProcurementRecord.js';
import { ProcurementBooking } from '../models/ProcurementBooking.js';
import { PaymentRecord } from '../models/PaymentRecord.js';
import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitQueueUpdate } from '../services/socketService.js';
import { getLiveQueueState } from '../services/queueService.js';

export const recordProcurementWeighment = async (req, res, next) => {
  try {
    const {
      bookingId,
      tokenNumber,
      actualQuantityQuintals,
      qualityGrade,
      moisturePercentage,
      mspPricePerQuintal,
      weighmentDetails,
      notes,
    } = req.body;

    if ((!bookingId && !tokenNumber) || !actualQuantityQuintals) {
      return sendError(res, 'tokenNumber (or bookingId) and actualQuantityQuintals are required', 'MISSING_FIELDS', 400);
    }

    let booking;
    if (bookingId) {
      booking = await ProcurementBooking.findById(bookingId).populate('farmerId centreId');
    } else if (tokenNumber) {
      booking = await ProcurementBooking.findOne({ tokenNumber: tokenNumber.trim() }).populate('farmerId centreId');
    }

    if (!booking) {
      return sendError(res, `Procurement booking ticket not found for token '${tokenNumber || bookingId}'`, 'NOT_FOUND', 404);
    }

    const mspPrice = Number(mspPricePerQuintal || 2275);
    const qty = Number(actualQuantityQuintals);
    const baseAmount = qty * mspPrice;

    // Quality Grade Deduction Logic
    let deductionPct = 0;
    if (qualityGrade === 'Grade B') deductionPct = 5;
    if (qualityGrade === 'Grade C') deductionPct = 15;
    if (qualityGrade === 'Rejected') deductionPct = 100;

    const totalAmount = Math.max(0, baseAmount - (baseAmount * deductionPct) / 100);

    // Create Procurement Record
    const record = await ProcurementRecord.create({
      bookingId: booking._id,
      farmerId: booking.farmerId._id,
      centreId: booking.centreId._id,
      staffId: req.user._id,
      cropType: booking.cropType,
      actualQuantityQuintals: qty,
      qualityGrade: qualityGrade || 'Grade A',
      moisturePercentage: Number(moisturePercentage || 12.0),
      mspPricePerQuintal: mspPrice,
      totalAmount,
      weighmentDetails: weighmentDetails || {},
      notes: notes || '',
    });

    // Update booking status to completed
    booking.status = 'completed';
    booking.completedTime = new Date();
    await booking.save();

    // Auto-create Payment Record awaiting manager approval
    const farmerUser = await User.findById(booking.farmerId._id);
    const bankDetails = farmerUser?.farmerDetails?.bankDetails || {};

    await PaymentRecord.create({
      procurementRecordId: record._id,
      farmerId: booking.farmerId._id,
      centreId: booking.centreId._id,
      amount: totalAmount,
      status: 'pending_approval',
      bankDetails: {
        accountName: bankDetails.accountName || farmerUser.name,
        accountNumber: bankDetails.accountNumber || 'Pending Details',
        ifscCode: bankDetails.ifscCode || 'SBIN0001234',
        bankName: bankDetails.bankName || 'State Bank of India',
      },
    });

    // Broadcast queue update so Completed Today immediately updates on all boards!
    try {
      const queueData = await getLiveQueueState(booking.centreId._id, booking.bookingDate);
      emitQueueUpdate(booking.centreId._id, queueData);
    } catch (e) {
      console.warn('Queue update broadcast warning:', e.message);
    }

    return sendSuccess(res, 'Procurement weighment recorded and payment entry created', { record, booking }, 201);
  } catch (err) {
    next(err);
  }
};

export const getProcurementRecords = async (req, res, next) => {
  try {
    const { centreId, farmerId } = req.query;
    const filter = {};

    if (centreId) filter.centreId = centreId;
    if (farmerId) filter.farmerId = farmerId;

    const records = await ProcurementRecord.find(filter)
      .populate('bookingId')
      .populate('farmerId', 'name phone preferredLanguage')
      .populate('staffId', 'name')
      .populate('centreId', 'name code')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Procurement records retrieved', { records, count: records.length });
  } catch (err) {
    next(err);
  }
};
