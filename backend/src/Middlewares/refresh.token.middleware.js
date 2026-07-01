import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import User from '../Models/user.model.js';
import bcrypt from 'bcryptjs';

export const protectRefresh = async (req, res, next) => {
  try {
    let token = req.cookies.refreshToken;
    if (!token) {
      return next(new AppError('refresh token is required', 400));
    }

    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
      return next(new AppError('user not found', 404));
    }

    const isValidToken = await bcrypt.compare(token, user.refreshToken);

    if (!isValidToken) {
      return next(new AppError('Invalid or expired refresh token', 401));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
};
