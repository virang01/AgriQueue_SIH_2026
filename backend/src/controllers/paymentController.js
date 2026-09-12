import { PaymentRecord } from '../models/PaymentRecord.js';
import { ProcurementBooking } from '../models/ProcurementBooking.js';
import { sendSMS } from '../services/smsService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getPayments = async (req, res, next) => {
  try {
    const { centreId, farmerId, status } = req.query;
    const filter = {};

    if (centreId) filter.centreId = centreId;
    if (farmerId) filter.farmerId = farmerId;
    if (status) filter.status = status;

    if (req.user.role === 'farmer') {
      filter.farmerId = req.user._id;
    }

    const payments = await PaymentRecord.find(filter)
      .populate('farmerId', 'name phone preferredLanguage')
      .populate({
        path: 'procurementRecordId',
        populate: { path: 'bookingId' },
      })
      .populate('centreId', 'name code')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Payments retrieved', { payments, count: payments.length });
  } catch (err) {
    next(err);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const payment = await PaymentRecord.findById(id).populate('farmerId procurementRecordId');
    if (!payment) {
      return sendError(res, 'Payment record not found', 'NOT_FOUND', 404);
    }

    payment.status = status;
    if (remarks) payment.remarks = remarks;

    if (status === 'approved') {
      payment.approvedBy = req.user._id;
      payment.approvedAt = new Date();
    }

    if (status === 'processed' || status === 'paid') {
      payment.processedAt = new Date();
      payment.paidAt = new Date();
      payment.paymentReference = `DBT-PFMS-${Date.now().toString().slice(-8)}`;
      payment.transactionRef = payment.paymentReference;

      // Update associated booking to completed
      if (payment.procurementRecordId && payment.procurementRecordId.bookingId) {
        await ProcurementBooking.findByIdAndUpdate(payment.procurementRecordId.bookingId, {
          status: 'completed',
        });
      }

      // Send SMS alert to farmer
      const farmer = payment.farmerId;
      if (farmer && farmer.phone) {
        await sendSMS({
          toPhone: farmer.phone,
          lang: farmer.preferredLanguage || 'hi',
          templateKey: 'payment_disbursed',
          templateData: {
            amount: payment.amount,
            bankAccount: payment.bankDetails?.accountNumber?.slice(-4) || 'XXXX',
            txnRef: payment.transactionRef,
          },
          userId: farmer._id,
        });
      }
    }

    await payment.save();
    return sendSuccess(res, `Payment status updated to '${status}'`, { payment });
  } catch (err) {
    next(err);
  }
};
