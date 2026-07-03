import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './src/Middlewares/error.middleware.js';
import http from 'http';

import authRouter from './src/Routes/auth.routes.js';
import categoryRouter from './src/Routes/category.routes.js';
import productRouter from './src/Routes/product.routes.js';
import orderRouter from './src/Routes/order.routes.js';

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);

app.all(/.*/, (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(errorHandler);

export default server;
