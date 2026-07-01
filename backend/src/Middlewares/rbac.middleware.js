import AppError from '../utils/AppError.js';

export const authorizedRoles = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorize to access this role'));
    }
    next();
  };
};
