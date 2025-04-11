import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import apiRoutes from './routes';
import { AppError, errorHandler } from './middleware/errorHandler';
import * as path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Auth error handling middleware
const authErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
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

// Add error handlers
app.use(authErrorHandler);
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
