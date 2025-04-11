import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import * as itemController from '../controllers/itemController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all items for an itinerary
router.get('/itinerary/:itineraryId', itemController.getItemsByItinerary);

// Get a single item by ID
router.get('/:id', itemController.getItemById);

// Create a new item
router.post('/', itemController.createItem);

// Update an existing item
router.put('/:id', itemController.updateItem);

// Delete an item
router.delete('/:id', itemController.deleteItem);

export default router;
