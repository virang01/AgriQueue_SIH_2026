import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, phone, email, password, role, preferredLanguage, farmerDetails } = req.body;

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return sendError(res, 'User with this phone number already registered', 'ALREADY_EXISTS', 400);
    }

    const user = await User.create({
      name,
      phone,
      email: email || '',
      password,
      role: role || 'farmer',
      preferredLanguage: preferredLanguage || 'hi',
      farmerDetails: farmerDetails || {},
    });

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      'User account registered successfully',
      {
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          farmerDetails: user.farmerDetails,
        },
        token,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return sendError(res, 'Please provide phone and password', 'MISSING_FIELDS', 400);
    }

    const user = await User.findOne({ phone }).populate('centreId');
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 'Invalid mobile number or password', 'INVALID_CREDENTIALS', 401);
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        centreId: user.centreId,
        farmerDetails: user.farmerDetails,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('centreId');
    return sendSuccess(res, 'User profile retrieved', { user });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, preferredLanguage, farmerDetails } = req.body;
    const user = await User.findById(req.user._id).populate('centreId');

    if (!user) {
      return sendError(res, 'User profile not found', 'NOT_FOUND', 404);
    }

    if (name) user.name = name;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (farmerDetails) {
      user.farmerDetails = { ...user.farmerDetails, ...farmerDetails };
    }

    await user.save();
    return sendSuccess(res, 'User profile updated successfully', { user });
  } catch (err) {
    next(err);
  }
};
