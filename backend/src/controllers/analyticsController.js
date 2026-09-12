import { User } from '../models/User.js';
import { Centre } from '../models/Centre.js';
import { ProcurementRecord } from '../models/ProcurementRecord.js';
import { PaymentRecord } from '../models/PaymentRecord.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const [centresCount, farmersCount, procStats, gradeDistribution] = await Promise.all([
      Centre.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'farmer' }),
      ProcurementRecord.aggregate([
        {
          $group: {
            _id: null,
            totalQty: { $sum: '$actualQuantityQuintals' },
            totalVal: { $sum: '$totalAmount' },
            avgMoisture: { $avg: '$moisturePercentage' },
          },
        },
      ]),
      ProcurementRecord.aggregate([
        {
          $group: {
            _id: '$qualityGrade',
            count: { $sum: 1 },
            totalQty: { $sum: '$actualQuantityQuintals' },
          },
        },
      ]),
    ]);

    const summary = procStats[0] || { totalQty: 0, totalVal: 0, avgMoisture: 0 };

    return sendSuccess(res, 'Analytics report fetched', {
      summary: {
        totalCentresCount: centresCount,
        totalFarmersCount: farmersCount,
        totalProcurementQuintals: summary.totalQty,
        totalProcurementValueRs: summary.totalVal,
        averageMoisturePercentage: Number(summary.avgMoisture.toFixed(1)),
      },
      gradeDistribution,
    });
  } catch (err) {
    next(err);
  }
};
