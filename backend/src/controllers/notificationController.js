import { Notification } from '../models/Notification.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'farmer') {
      filter.userId = req.user._id;
    }

    const notifications = await Notification.find(filter)
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(res, 'Notifications retrieved', { notifications });
  } catch (err) {
    next(err);
  }
};
