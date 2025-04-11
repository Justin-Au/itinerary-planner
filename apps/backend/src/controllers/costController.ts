import { Request, Response, NextFunction } from 'express';
import { prisma } from 'db';

// Get all costs for an item
export const getCostsByItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the item exists and belongs to the user's itinerary
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { itinerary: true },
    });
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    if (item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to access costs for this item' });
      return;
    }
    
    const costs = await prisma.cost.findMany({
      where: { itemId },
    });
    
    res.status(200).json({ costs });
  } catch (error) {
    next(error);
  }
};

// Create a new cost
export const createCost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { amount, currency, itemId } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the item exists and belongs to the user's itinerary
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { itinerary: true },
    });
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    if (item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to add costs to this item' });
      return;
    }
    
    const newCost = await prisma.cost.create({
      data: {
        amount,
        currency,
        itemId,
      },
    });
    
    res.status(201).json({
      message: 'Cost created successfully',
      cost: newCost,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing cost
export const updateCost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, currency } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Check if the cost exists
    const existingCost = await prisma.cost.findUnique({
      where: { id },
      include: { item: { include: { itinerary: true } } },
    });
    
    if (!existingCost) {
      res.status(404).json({ message: 'Cost not found' });
      return;
    }
    
    // Check if the cost's item belongs to an itinerary owned by the user
    if (existingCost.item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to update this cost' });
      return;
    }
    
    const updatedCost = await prisma.cost.update({
      where: { id },
      data: {
        amount,
        currency,
      },
    });
    
    res.status(200).json({
      message: 'Cost updated successfully',
      cost: updatedCost,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a cost
export const deleteCost = async (
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
    
    // Check if the cost exists
    const existingCost = await prisma.cost.findUnique({
      where: { id },
      include: { item: { include: { itinerary: true } } },
    });
    
    if (!existingCost) {
      res.status(404).json({ message: 'Cost not found' });
      return;
    }
    
    // Check if the cost's item belongs to an itinerary owned by the user
    if (existingCost.item.itinerary.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this cost' });
      return;
    }
    
    await prisma.cost.delete({
      where: { id },
    });
    
    res.status(200).json({
      message: 'Cost deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
