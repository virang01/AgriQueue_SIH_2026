import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import farmerRoutes from './routes/farmer.routes.js';
import centreRoutes from './routes/centre.routes.js';
import slotRoutes from './routes/slot.routes.js';
import queueRoutes from './routes/queue.routes.js';
import procurementRoutes from './routes/procurement.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API v1 Primary Route Mounts
const apiV1Router = express.Router();
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/farmer', farmerRoutes);
apiV1Router.use('/centres', centreRoutes);
apiV1Router.use('/slots', slotRoutes);
apiV1Router.use('/queue', queueRoutes);
apiV1Router.use('/procurement', procurementRoutes);
apiV1Router.use('/payments', paymentRoutes);
apiV1Router.use('/notifications', notificationRoutes);
apiV1Router.use('/admin', adminRoutes);
apiV1Router.use('/analytics', analyticsRoutes);

apiV1Router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AgriQueue Backend Engine API v1 Running',
    timestamp: new Date(),
  });
});

// Mount /api/v1 and alias /api to /api/v1 for 100% frontend compatibility
app.use('/api/v1', apiV1Router);
app.use('/api', apiV1Router);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
    error: 'NOT_FOUND',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
