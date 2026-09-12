import { ProcurementBooking } from '../models/ProcurementBooking.js';
import { getLiveQueueState, processCheckIn, callNextInQueue } from '../services/queueService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getLiveQueue = async (req, res, next) => {
  try {
    const { centreId, date } = req.query;
    if (!centreId) {
      return sendError(res, 'centreId parameter is required', 'MISSING_PARAM', 400);
    }

    const state = await getLiveQueueState(centreId, date);
    return sendSuccess(res, 'Live queue state fetched', state);
  } catch (err) {
    next(err);
  }
};

export const checkInFarmerToken = async (req, res, next) => {
  try {
    const { tokenNumber } = req.body;
    if (!tokenNumber) {
      return sendError(res, 'tokenNumber is required for check-in', 'MISSING_TOKEN', 400);
    }

    const booking = await processCheckIn(tokenNumber);
    return sendSuccess(res, `Token ${tokenNumber} checked in successfully`, { booking });
  } catch (err) {
    return sendError(res, err.message, 'CHECKIN_FAILED', 400);
  }
};

export const callNextToken = async (req, res, next) => {
  try {
    const { bookingId, centreId } = req.body;
    const staffCentreId = centreId || req.user?.centreId?._id || req.user?.centreId;

    if (!bookingId && !staffCentreId) {
      return sendError(res, 'bookingId or centreId parameter is required', 'MISSING_PARAM', 400);
    }

    const booking = await callNextInQueue(bookingId, staffCentreId);
    return sendSuccess(res, `Called token ${booking.tokenNumber} (${booking.farmerId?.name || 'Farmer'}) to inspection counter`, { booking });
  } catch (err) {
    return sendError(res, err.message, 'CALL_NEXT_FAILED', 400);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await ProcurementBooking.find({ farmerId: req.user._id })
      .populate('centreId', 'name code district')
      .populate('slotId')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'My bookings fetched', { bookings });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await ProcurementBooking.findOne({ _id: id, farmerId: req.user._id });

    if (!booking) {
      return sendError(res, 'Booking ticket not found', 'NOT_FOUND', 404);
    }

    if (booking.status !== 'booked') {
      return sendError(res, `Cannot cancel ticket in status '${booking.status}'`, 'CANCEL_INVALID', 400);
    }

    booking.status = 'cancelled';
    await booking.save();

    return sendSuccess(res, 'Booking ticket cancelled', { booking });
  } catch (err) {
    next(err);
  }
};
