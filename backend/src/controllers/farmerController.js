import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getFarmerProfile = async (req, res, next) => {
  try {
    const farmer = await User.findById(req.user._id).select('-password');
    if (!farmer) {
      return sendError(res, 'Farmer profile not found', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Farmer profile fetched', { farmer });
  } catch (err) {
    next(err);
  }
};

export const updateFarmerProfile = async (req, res, next) => {
  try {
    const { name, preferredLanguage, farmerDetails } = req.body;
    const farmer = await User.findById(req.user._id);

    if (!farmer) {
      return sendError(res, 'Farmer profile not found', 'NOT_FOUND', 404);
    }

    if (name) farmer.name = name;
    if (preferredLanguage) farmer.preferredLanguage = preferredLanguage;
    if (farmerDetails) {
      farmer.farmerDetails = { ...farmer.farmerDetails, ...farmerDetails };
    }

    await farmer.save();
    return sendSuccess(res, 'Farmer profile updated successfully', { farmer });
  } catch (err) {
    next(err);
  }
};
