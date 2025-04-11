import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login with email and password
router.post('/login', passport.authenticate('local', { session: false }), authController.login);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), authController.getCurrentUser);

// Logout
router.post('/logout', authController.logout);

export default router;
