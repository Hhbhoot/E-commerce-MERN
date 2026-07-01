import Product from '../Models/product.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import fs from 'fs';

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return next(new AppError('All fields are required', 400));
  }
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => file.path.replace('\\', '/'));
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    images,
    createdBy: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Product created successfully',
    data: newProduct,
  });
});

export const getAllProductsForSeller = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const products = await Product.find({
    createdBy: req.user._id,
  })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments({
    createdBy: req.user._id,
  });

  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    status: 'success',
    message: 'Products fetched successfully',
    data: products,
    pagination: {
      totalProducts,
      totalPages,
      currentPage: page,
    },
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  let query = {};

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const products = await Product.find(query).skip(skip).limit(limit);

  const totalProducts = await Product.countDocuments(query);

  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    status: 'success',
    message: 'Products fetched successfully',
    data: products,
    pagination: {
      totalProducts,
      totalPages,
      currentPage: page,
    },
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Product id is required', 400));
  }

  const productImages = await Product.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!productImages) {
    return next(new AppError('Product not found', 404));
  }

  productImages.images.forEach((image) =>
    fs.unlink(image, (err) => {
      if (err) {
        console.log('Failed to delete image');
      }
    }),
  );

  const product = await Product.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Product is required', 400));
  }

  const product = await Product.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const deleteImageIndex = req.body.deleteImageIndex
    ? req.body.deleteImageIndex.split(',')
    : [];

  let images = product.images.filter((image, index) => {
    if (deleteImageIndex.includes(index.toString())) {
      fs.unlink(image, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return false;
    }

    return true;
  });
  let newImages = [];
  if (req.files && req.files.length > 0) {
    newImages = req.files.map((file) => file.path.replaceAll('\\', '/'));
  }

  const updateProduct = await Product.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    {
      ...req.body,
      images: [...images, ...newImages],
    },
    {
      returnDocument: 'after',
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Product updated Successfully',
    data: updateProduct,
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Product id is required', 400));
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'fail',
    message: 'Product fetched successfully',
    data: product,
  });
});
