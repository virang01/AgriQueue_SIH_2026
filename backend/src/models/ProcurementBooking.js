import mongoose from 'mongoose';

const procurementBookingSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: String,
      required: true,
      unique: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Centre',
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    bookingDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    cropType: {
      type: String,
      enum: ['Wheat', 'Paddy', 'Pulses', 'Mustard', 'Chana', 'Maize', 'Cotton', 'Soyabean'],
      required: true,
    },
    estimatedQuantityQuintals: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['booked', 'checked_in', 'in_inspection', 'weighment_completed', 'completed', 'cancelled', 'no_show'],
      default: 'booked',
    },
    checkInTime: { type: Date, default: null },
    calledTime: { type: Date, default: null },
    completedTime: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ProcurementBooking =
  mongoose.models.ProcurementBooking || mongoose.model('ProcurementBooking', procurementBookingSchema);
