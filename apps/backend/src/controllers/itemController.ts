import { Request, Response, NextFunction } from 'express';
import { prisma } from 'db';

// Get all items for an itinerary
export const getItemsByItinerary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the itinerary exists and belongs to the user
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });
    
    if (!itinerary) {
      res.status(404).json({ message: 'Itinerary not found' });
      return;
    }
    
    if (itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to access this itinerary' });
      return;
    }
    
    // Get all items for the itinerary
    const items = await prisma.item.findMany({
      where: { itineraryId },
      include: {
        cost: true,
        category: true,
      },
      orderBy: { date: 'asc' },
    });
    
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

// Get a single item by ID
export const getItemById = async (
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
    
    // Get the item with its itinerary to check ownership
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        cost: true,
        category: true,
        itinerary: true,
      },
    });
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    // Check if the item's itinerary belongs to the user
    if (item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to access this item' });
      return;
    }
    
    // Remove the itinerary from the response to avoid circular references
    const { itinerary: _, ...itemWithoutItinerary } = item;
    
    res.status(200).json({ item: itemWithoutItinerary });
  } catch (error) {
    next(error);
  }
};

// Create a new item
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      date,
      startTime,
      endTime,
      location,
      notes,
      itineraryId,
      categoryId,
      cost,
    } = req.body;
    
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the itinerary exists and belongs to the user
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });
    
    if (!itinerary) {
      res.status(404).json({ message: 'Itinerary not found' });
      return;
    }
    
    if (itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to add items to this itinerary' });
      return;
    }
    
    // Create the new item
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        notes,
        itineraryId,
        categoryId,
        // Create costs if provided
        cost: cost ? {
          create: cost.map((cost: { amount: number; currency: string }) => ({
            amount: cost.amount,
            currency: cost.currency,
          })),
        } : undefined,
      },
      include: {
        cost: true,
        category: true,
      },
    });
    
    res.status(201).json({
      message: 'Item created successfully',
      item: newItem,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing item
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      date,
      startTime,
      endTime,
      location,
      notes,
      categoryId,
    } = req.body;
    
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Get the item with its itinerary to check ownership
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        itinerary: true,
      },
    });
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    // Check if the item's itinerary belongs to the user
    if (item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to update this item' });
      return;
    }
    
    // Update the item
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        location,
        notes,
        categoryId,
      },
      include: {
        cost: true,
        category: true,
      },
    });
    
    res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an item
export const deleteItem = async (
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
    
    // Get the item with its itinerary to check ownership
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        itinerary: true,
      },
    });
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    // Check if the item's itinerary belongs to the user
    if (item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this item' });
      return;
    }
    
    // Delete all costs related to this item
    await prisma.cost.deleteMany({
      where: { itemId: id },
    });
    
    // Delete the item
    await prisma.item.delete({
      where: { id },
    });
    
    res.status(200).json({
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
