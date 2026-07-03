import Order from '../Models/orders.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../Middlewares/auth.middleware.js';
import { authorizedRoles } from '../Middlewares/rbac.middleware.js';
import AppError from '../utils/AppError.js';
import Product from '../Models/product.model.js';
import User from '../Models/user.model.js';

export const createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return next(new AppError('User id is required', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!orderItems || !shippingAddress) {
    return next(new AppError('All filds are required'));
  }

  for (let item of orderItems) {
    const product = await Product.findById(item.product).select('stock');

    if (product.stock < item.quantity) {
      return next(new AppError('Some Product are out of stock', 400));
    }
  }

  const totalSaleValue = orderItems.reduce(
    (acc, val) => acc + val.price * val.quantity,
    0,
  );

  const order = await Order.create({
    orderItems,
    shippingAddress,
    totalPrice: totalSaleValue,
    userId: req.user._id,
  });

  orderItems.forEach(async (item) => {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } },
      { new: true },
    );
  });

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    data: order,
  });
});
