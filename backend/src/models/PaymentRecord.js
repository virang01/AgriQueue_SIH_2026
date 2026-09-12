import mongoose from 'mongoose';

const paymentRecordSchema = new mongoose.Schema(
  {
    procurementRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProcurementRecord',
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
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'processed', 'failed', 'pending', 'processing', 'paid'],
      default: 'pending_approval',
    },
    bankDetails: {
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
    },
    paymentReference: {
      type: String,
      default: '',
    },
    transactionRef: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: { type: Date, default: null },
    processedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PaymentRecord =
  mongoose.models.PaymentRecord || mongoose.model('PaymentRecord', paymentRecordSchema);
export const Payment = PaymentRecord;
