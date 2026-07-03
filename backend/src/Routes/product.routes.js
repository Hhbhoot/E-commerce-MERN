import express from 'express';
import { protect } from '../Middlewares/auth.middleware.js';
import { authorizedRoles } from '../Middlewares/rbac.middleware.js';

import * as productController from '../Controllers/product.controller.js';
import upload from '../Middlewares/multer.middleware.js';

const productRouter = express.Router();

productRouter
  .route('/')
  .get(
    protect,
    authorizedRoles('Customer', "Seller", 'Admin'),
    productController.getAllProducts,
  );

productRouter
  .route('/seller')
  .get(
    protect,
    authorizedRoles('Seller'),
    productController.getAllProductsForSeller,
  )
  .post(
    protect,
    authorizedRoles('Seller'),
    upload.array('images'),
    productController.createProduct,
  );

productRouter
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    protect,
    authorizedRoles('Seller'),
    upload.array('images'),
    productController.updateProduct,
  )
  .delete(protect, authorizedRoles('Seller'), productController.deleteProduct);

export default productRouter;
