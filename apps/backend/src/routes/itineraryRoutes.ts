import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import * as itineraryController from '../controllers/itineraryController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all itineraries for the current user
router.get('/', itineraryController.getAllItineraries);

// Get a single itinerary by ID
router.get('/:id', itineraryController.getItineraryById);

// Create a new itinerary
router.post('/', itineraryController.createItinerary);

// Update an existing itinerary
router.put('/:id', itineraryController.updateItinerary);

// Delete an itinerary
router.delete('/:id', itineraryController.deleteItinerary);

export default router;
