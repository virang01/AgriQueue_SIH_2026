import { Centre } from '../models/Centre.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getCentres = async (req, res, next) => {
  try {
    const centres = await Centre.find({ isActive: true }).sort({ code: 1, name: 1 });
    return sendSuccess(res, 'Centres list retrieved', { centres, count: centres.length });
  } catch (err) {
    next(err);
  }
};

export const createCentre = async (req, res, next) => {
  try {
    const { name, code, state, district, address, dailyCapacityQuintals, supportedCrops } = req.body;

    const existing = await Centre.findOne({ code: code.toUpperCase() });
    if (existing) {
      return sendError(res, `Centre code '${code}' already exists`, 'ALREADY_EXISTS', 400);
    }

    const centre = await Centre.create({
      name,
      code: code.toUpperCase(),
      state,
      district,
      address,
      dailyCapacityQuintals: Number(dailyCapacityQuintals || 1000),
      supportedCrops: supportedCrops || ['Wheat', 'Paddy', 'Pulses', 'Mustard'],
    });

    return sendSuccess(res, 'Procurement Centre created successfully', { centre }, 201);
  } catch (err) {
    next(err);
  }
};

export const getCentreById = async (req, res, next) => {
  try {
    const centre = await Centre.findById(req.params.id);
    if (!centre) {
      return sendError(res, 'Centre not found', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Centre details retrieved', { centre });
  } catch (err) {
    next(err);
  }
};
