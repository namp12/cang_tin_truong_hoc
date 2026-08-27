import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testDbConnection } from './config/database.js';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import { initSocketServer } from './socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Core Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base & Health Route
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Smart School Canteen Management API (DNU)',
    version: '1.0.0',
    realtime: 'Socket.io Active',
  });
});

// API Modules
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/orders', ordersRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server with Socket.io
async function bootstrap() {
  await testDbConnection();

  const httpServer = http.createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 DNU Canteen Backend API Server running at: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`⚡ WebSocket Server listening for Realtime POS/Kitchen events!`);
  });
}

bootstrap();
