import User from '../Models/user.model.js';
import AppError from '../utils/AppError.js';
import { httpUrl, safeParse } from 'zod';
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcryptjs';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from '../Schemas/user.schema.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { id } from 'zod/v4/locales';

export const register = asyncHandler(async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: 'fail',
      error: result.error.issues,
    });
  }

  const { email, fullName, password, gender, addresses, role } = result.data;

  const isUserRegistered = await User.findOne({ email });

  if (isUserRegistered) {
    return next(new AppError('email already registered', 400));
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    email,
    password: hashPassword,
    gender,
    role,
    addresses,
  });

  const accessToken = generateAccessToken({
    id: newUser._id,
    role: newUser.role,
  });

  const refreshToken = generateRefreshToken({
    id: newUser._id,
    role: newUser.role,
  });

  const hasedRefreshToken = await bcrypt.hash(refreshToken, 10);

  newUser.refreshToken = hasedRefreshToken;
  await newUser.save();

  const user = newUser.toObject();
  delete user.password;
  delete user.refreshToken;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: 'success',
    message: 'user registered successfully',
    data: user,
    token: accessToken,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(200).json({
      status: 'fail',
      message: 'Failed to Login',
      error: result.error.flatten(),
    });
  }

  const { email, password } = result.data;

  const isUserExists = await User.findOne({ email }).select('+password');

  if (!isUserExists) {
    return next(new AppError('Invalid credentials', 404));
  }

  const comparePassword = await bcrypt.compare(password, isUserExists.password);

  if (!comparePassword) {
    return next(new AppError('Invalid credentials', 401));
  }

  const accessToken = generateAccessToken({
    id: isUserExists._id,
    role: isUserExists.role,
  });

  const refreshToken = generateRefreshToken({
    id: isUserExists._id,
    role: isUserExists.role,
  });

  const hasedRefreshToken = await bcrypt.hash(refreshToken, 10);

  isUserExists.refreshToken = hasedRefreshToken;

  await isUserExists.save();

  res.cookie('refreshToken', refreshToken, {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const user = isUserExists.toObject();

  delete user.password;
  delete user.refreshToken;

  res.status(201).json({
    status: 'success',
    message: 'user logged in successfully',
    data: user,
    token: accessToken,
  });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Profile fetched successfully',
    data: req.user,
  });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const role = req.user.role;

  const accessToken = generateAccessToken({
    id: userId,
    role: role,
  });

  const refreshToken = generateRefreshToken({
    id: userId,
    role: role,
  });

  const hasedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await User.findByIdAndUpdate(userId, {
    refreshToken: hasedRefreshToken,
  });

  res.cookie('refreshToken', refreshToken, {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: 'success',
    message: 'Token refresh successfully',
    token: accessToken,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('+refreshToken');

  if (!user) {
    return next(new AppError('user not found', 404));
  }

  user.refreshToken = '';

  await user.save();

  res.clearCookie('refreshToken', {
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(200).json({
      status: 'fail',
      message: 'Failed to update profile',
      error: result.error.flatten(),
    });
  }

  const user = await User.findById(userId).select('+password');

  if (!user) {
    return next(new AppError('user not found', 404));
  }

  const updateProfile = await User.findByIdAndUpdate(
    userId,
    {
      ...result.data,
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: updateProfile,
  });
});

export const addNewAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const { addresses } = req.body;

  if (addresses.length === 0) {
    return next(new AppError('Address is required', 400));
  }

  const updateAddress = await User.findByIdAndUpdate(
    userId,
    {
      $push: { addresses: { $each: addresses } },
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Address added successfully',
    data: updateAddress,
  });
});

export const deleteAddress = asyncHandler(async (req, res, next) => {
  const addressId = req.params.id;
  const userId = req.user._id;

  const updateAddress = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        addresses: {
          _id: addressId,
        },
      },
    },
    { new: true },
  );

  if (!updateAddress) {
    return next(new AppError('Failed to delete address', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'address deleted successfully',
  });
});

export const updateSingleAddress = asyncHandler(async (req, res, next) => {
  const addressId = req.params.id;
  const userId = req.user._id;

  if (!addressId) {
    return next(new AppError('Address id is required', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('user not found', 404));
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    return next(new AppError('Invalid addressId', 400));
  }

  address.set(req.body);

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Address update successfully',
  });
});

export const getAllAddresses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('user not found', 404));
  }

  const addresses = user.addresses;

  res.status(200).json({
    status: 'success',
    message: 'Address fetched successfully',
    data: addresses,
  });
});

// 7383915332 - whirpool customer number
