import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
};
