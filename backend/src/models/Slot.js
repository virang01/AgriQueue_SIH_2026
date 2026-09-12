import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Centre',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    startTime: {
      type: String, // e.g. "08:00"
      required: true,
    },
    endTime: {
      type: String, // e.g. "10:00"
      required: true,
    },
    timeWindow: {
      type: String, // e.g. "08:00 - 10:00"
      default: '',
    },
    maxCapacityQuintals: {
      type: Number,
      default: 200,
    },
    bookedCapacityQuintals: {
      type: Number,
      default: 0,
    },
    maxFarmers: {
      type: Number,
      default: 5,
    },
    bookedFarmers: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Slot = mongoose.models.Slot || mongoose.model('Slot', slotSchema);
