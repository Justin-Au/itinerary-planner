import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import passport from 'passport';
import { User } from 'db';

// Extend Express Request type to include user
declare global {
  namespace Express {
    // Use a more specific type to avoid recursive reference
    interface User {
      id: string;
      email: string;
      name: string | null;
      createdAt: Date;
      updatedAt: Date;
      oauthProvider: string | null;
      oauthId: string | null;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
    if (err) {
      next(err);
      return;
    }
    
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to handle errors in authentication
export const handleAuthErrors: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Token expired' });
    return;
  }
  
  next(err);
};
