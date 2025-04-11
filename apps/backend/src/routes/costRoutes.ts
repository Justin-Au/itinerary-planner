import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import * as costController from '../controllers/costController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all costs for an item
router.get('/item/:itemId', costController.getCostsByItem);

// Create a new cost
router.post('/', costController.createCost);

// Update an existing cost
router.put('/:id', costController.updateCost);

// Delete a cost
router.delete('/:id', costController.deleteCost);

export default router;
