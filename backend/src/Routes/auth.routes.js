import express from 'express';
import * as authController from '../Controllers/auth.controllers.js';
import { protect } from '../Middlewares/auth.middleware.js';
import { protectRefresh } from '../Middlewares/refresh.token.middleware.js';
import { authorizedRoles } from '../Middlewares/rbac.middleware.js';
const authRouter = express.Router();

authRouter.route('/register').post(authController.register);
authRouter.route('/login').post(authController.login);
authRouter.route('/logout').get(protect, authController.logout);
authRouter.route('/get-me').get(protect, authController.getProfile);
authRouter.route('/profile').patch(protect, authController.updateProfile);
authRouter
  .route('/refresh-token')
  .get(protectRefresh, authController.refreshAccessToken);

authRouter.route('/addresses').patch(protect, authController.addNewAddress);
authRouter.route('/addresses').get(protect, authController.getAllAddresses);
authRouter
  .route('/addresses/:id')
  .delete(protect, authController.deleteAddress);

authRouter
  .route('/addresses/:id')
  .patch(protect, authController.updateSingleAddress);

export default authRouter;
