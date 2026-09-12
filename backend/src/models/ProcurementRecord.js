import mongoose from 'mongoose';

const procurementRecordSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProcurementBooking',
      required: true,
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
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    actualQuantityQuintals: {
      type: Number,
      required: true,
    },
    qualityGrade: {
      type: String,
      enum: ['Grade A', 'Grade B', 'Grade C', 'Rejected'],
      default: 'Grade A',
    },
    moisturePercentage: {
      type: Number,
      default: 12.0,
    },
    mspPricePerQuintal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    weighmentDetails: {
      bagCount: { type: Number, default: 0 },
      grossWeightKg: { type: Number, default: 0 },
      tareWeightKg: { type: Number, default: 0 },
      netWeightKg: { type: Number, default: 0 },
    },
    procuredAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const ProcurementRecord =
  mongoose.models.ProcurementRecord || mongoose.model('ProcurementRecord', procurementRecordSchema);
export const Procurement = ProcurementRecord;
