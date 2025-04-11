import express from 'express';
import authRoutes from './authRoutes';
import itineraryRoutes from './itineraryRoutes';
import itemRoutes from './itemRoutes';
import costRoutes from './costRoutes';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Register all routes
router.use('/auth', authRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/items', itemRoutes);
router.use('/costs', costRoutes);

export default router;
