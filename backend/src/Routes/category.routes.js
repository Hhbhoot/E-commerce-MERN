import express from 'express';
import * as categoryController from '../Controllers/category.controller.js';
import { protect } from '../Middlewares/auth.middleware.js';
import { authorizedRoles } from '../Middlewares/rbac.middleware.js';

const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(protect, authorizedRoles('Seller'), categoryController.createCategory);

categoryRouter
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(protect, authorizedRoles('Seller'), categoryController.updateCategory)
  .delete(
    protect,
    authorizedRoles('Seller'),
    categoryController.deleteCategory,
  );

export default categoryRouter;
