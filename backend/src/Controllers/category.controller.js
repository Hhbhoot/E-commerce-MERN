import Category from '../Models/category.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const createCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  const isCategoryExists = await Category.findOne({
    category,
    createdBy: req.user._id,
  });

  if (isCategoryExists) {
    return next(new AppError('Category already exists', 400));
  }

  const newCategory = await Category.create({
    category,
    slug: slugify(category, {
      lower: true,
      strict: true,
    }),
    createdBy: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Category created successfully',
    data: newCategory,
  });
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().select('-createdBy');

  res.status(200).json({
    status: 'success',
    message: 'Categories fetched successfully',
    data: categories,
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { category } = req.body;

  const categoryExists = await Category.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!categoryExists) {
    return next(new AppError('Category not found', 404));
  }

  categoryExists.category = category;
  categoryExists.slug = slugify(category, {
    lower: true,
    strict: true,
  });

  await categoryExists.save();

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: categoryExists,
  });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Category fetched successfully',
    data: category,
  });
});
