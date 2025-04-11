import { Request, Response, NextFunction } from 'express';
import { prisma } from 'db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';

// Register a new user
export const register = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    
    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // User is already authenticated by Passport
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
    });
    
    // Remove password from response
    const userObj = user as any;
    const { password: _, ...userWithoutPassword } = userObj;
    
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth callback
export const googleCallback = async (
  req: Request, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.redirect('/login?error=authentication_failed');
      return;
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
    });
    
    // Redirect to frontend with token
    res.redirect(`/auth/success?token=${token}`);
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Remove password from response
    const userObj = user as any;
    const { password: _, ...userWithoutPassword } = userObj;
    
    res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (
  req: Request, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: 'Error during logout' });
        return;
      }
      
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    next(error);
  }
};
