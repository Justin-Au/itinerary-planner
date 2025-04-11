import { Request, Response, NextFunction } from 'express';
import { prisma } from 'db';

// Get all itineraries for the current user
export const getAllItineraries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const itineraries = await prisma.itinerary.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
    
    res.status(200).json({ itineraries });
  } catch (error) {
    next(error);
  }
};

// Get a single itinerary by ID
export const getItineraryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            category: true,
            cost: true,
          },
          orderBy: { date: 'asc' },
        },
      },
    });
    
    if (!itinerary) {
      res.status(404).json({ message: 'Itinerary not found' });
      return;
    }
    
    if (itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to access this itinerary' });
      return;
    }
    
    res.status(200).json({ itinerary });
  } catch (error) {
    next(error);
  }
};

// Create a new itinerary
export const createItinerary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const newItinerary = await prisma.itinerary.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        userId,
      },
    });
    
    res.status(201).json({
      message: 'Itinerary created successfully',
      itinerary: newItinerary,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing itinerary
export const updateItinerary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the itinerary exists
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
    });
    
    if (!existingItinerary) {
      res.status(404).json({ message: 'Itinerary not found' });
      return;
    }
    
    // Check if the itinerary belongs to the user
    if (existingItinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to update this itinerary' });
      return;
    }
    
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        title,
        description,
        startDate,
        endDate,
      },
    });
    
    res.status(200).json({
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an itinerary
export const deleteItinerary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the itinerary exists
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
    });
    
    if (!existingItinerary) {
      res.status(404).json({ message: 'Itinerary not found' });
      return;
    }
    
    // Check if the itinerary belongs to the user
    if (existingItinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this itinerary' });
      return;
    }
    
    // Delete all items and their costs
    await prisma.itinerary.delete({
      where: { id },
    });
    
    res.status(200).json({
      message: 'Itinerary deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
