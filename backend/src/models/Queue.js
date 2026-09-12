import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema(
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
    currentlyServingToken: {
      type: String,
      default: null,
    },
    tokens: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcurementBooking' },
        tokenNumber: { type: String },
        status: {
          type: String,
          enum: ['waiting', 'in-progress', 'done', 'no-show'],
          default: 'waiting',
        },
        livePosition: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Queue = mongoose.models.Queue || mongoose.model('Queue', queueSchema);
