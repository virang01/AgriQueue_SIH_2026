import { ProcurementBooking } from '../models/ProcurementBooking.js';
import { emitQueueUpdate } from './socketService.js';
import { sendSMS } from './smsService.js';

export const getLiveQueueState = async (centreId, targetDate) => {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];

  const bookings = await ProcurementBooking.find({
    centreId,
    bookingDate: dateStr,
  })
    .populate('farmerId', 'name phone preferredLanguage')
    .populate('slotId')
    .sort({ createdAt: 1 });

  const checkedInWaiting = bookings.filter((b) => b.status === 'checked_in');
  const upcomingBooked = bookings.filter((b) => b.status === 'booked');
  const completedToday = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'weighment_completed'
  );
  const currentlyServing = bookings.find((b) => b.status === 'in_inspection');

  return {
    date: dateStr,
    currentlyServing: currentlyServing || null,
    checkedInWaiting,
    upcomingBooked,
    completedToday,
    summary: {
      totalTotalBooked: bookings.length,
      checkedInWaitingCount: checkedInWaiting.length,
      completedCount: completedToday.length,
    },
  };
};

export const processCheckIn = async (tokenNumber) => {
  const booking = await ProcurementBooking.findOne({ tokenNumber }).populate('farmerId');
  if (!booking) {
    throw new Error('Invalid token ticket number');
  }

  if (booking.status !== 'booked') {
    throw new Error(`Token ${tokenNumber} is already in status '${booking.status}'`);
  }

  booking.status = 'checked_in';
  booking.checkInTime = new Date();
  await booking.save();

  // Socket notification
  const queueData = await getLiveQueueState(booking.centreId, booking.bookingDate);
  emitQueueUpdate(booking.centreId, queueData);

  return booking;
};

export const callNextInQueue = async (bookingId, centreId) => {
  let booking;
  if (bookingId) {
    booking = await ProcurementBooking.findById(bookingId).populate('farmerId centreId');
  } else if (centreId) {
    const today = new Date().toISOString().split('T')[0];
    booking = await ProcurementBooking.findOne({
      centreId,
      bookingDate: today,
      status: 'checked_in',
    })
      .sort({ checkInTime: 1, createdAt: 1 })
      .populate('farmerId centreId');
  }

  if (!booking) {
    throw new Error('No checked-in farmers are currently waiting in queue to be called');
  }

  const cId = booking.centreId?._id || booking.centreId;

  // Mark previous in_inspection ticket as completed so Completed Today updates properly!
  await ProcurementBooking.updateMany(
    {
      centreId: cId,
      bookingDate: booking.bookingDate,
      status: 'in_inspection',
      _id: { $ne: booking._id },
    },
    {
      status: 'completed',
      completedTime: new Date(),
    }
  );

  booking.status = 'in_inspection';
  booking.calledTime = new Date();
  await booking.save();

  // Send turn alert SMS
  const farmer = booking.farmerId;
  if (farmer && farmer.phone) {
    await sendSMS({
      toPhone: farmer.phone,
      lang: farmer.preferredLanguage || 'hi',
      templateKey: 'turn_alert',
      templateData: {
        tokenNumber: booking.tokenNumber,
        centreName: booking.centreId?.name || 'Procurement Centre',
      },
      userId: farmer._id,
    });
  }

  const queueData = await getLiveQueueState(cId, booking.bookingDate);
  emitQueueUpdate(cId, queueData);

  return booking;
};
