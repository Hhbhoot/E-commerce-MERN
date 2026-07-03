import express from 'express';
import * as orderController from '../Controllers/order.controllers.js';
import { protect } from '../Middlewares/auth.middleware.js';
import { authorizedRoles } from '../Middlewares/rbac.middleware.js';

const orderRouter = express.Router();

orderRouter
  .route('/')
  .post(protect, authorizedRoles('Customer'), orderController.createOrder);

export default orderRouter;
