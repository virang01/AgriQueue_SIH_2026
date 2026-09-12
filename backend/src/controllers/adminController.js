import { User } from '../models/User.js';
import { Centre } from '../models/Centre.js';
import { ProcurementRecord } from '../models/ProcurementRecord.js';
import { PaymentRecord } from '../models/PaymentRecord.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getAdminOverview = async (req, res, next) => {
  try {
    const [centresCount, farmersCount, procurementStats, paymentStats] = await Promise.all([
      Centre.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'farmer' }),
      ProcurementRecord.aggregate([
        {
          $group: {
            _id: null,
            totalQty: { $sum: '$actualQuantityQuintals' },
            totalVal: { $sum: '$totalAmount' },
            avgMoisture: { $avg: '$moisturePercentage' },
            count: { $sum: 1 },
          },
        },
      ]),
      PaymentRecord.aggregate([
        {
          $group: {
            _id: '$status',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const procSummary = procurementStats[0] || { totalQty: 0, totalVal: 0, avgMoisture: 0, count: 0 };

    return sendSuccess(res, 'Admin overview aggregated', {
      summary: {
        totalCentresCount: centresCount,
        totalFarmersCount: farmersCount,
        totalProcurementQuintals: procSummary.totalQty,
        totalProcurementValueRs: procSummary.totalVal,
        averageMoisturePercentage: Number(procSummary.avgMoisture.toFixed(1)),
        totalInspectionsCount: procSummary.count,
      },
      paymentBreakdown: paymentStats,
    });
  } catch (err) {
    next(err);
  }
};
