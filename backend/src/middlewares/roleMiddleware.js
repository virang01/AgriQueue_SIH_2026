import { sendError } from '../utils/apiResponse.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'User identity unverified', 'UNAUTHORIZED', 401);
    }

    const allowedRoles = [...roles];
    if (allowedRoles.includes('admin') || allowedRoles.includes('govt_admin')) {
      allowedRoles.push('admin', 'govt_admin');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        'FORBIDDEN',
        403
      );
    }
    next();
  };
};
