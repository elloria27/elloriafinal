
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateTokens, verifyToken } from '../utils/auth-utils';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    // In a real app, we would check our database here
    // For demo purposes, we'll just return success
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // In a real app, we would save the user to our database here
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        email,
        full_name,
        id: 'user-' + Math.random().toString(36).substr(2, 9)
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // In a real app, we would retrieve the user from our database and check the password
    // For demo purposes, we'll just generate tokens
    
    const user = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      full_name: 'Demo User',
      role: 'user'
    };
    
    const { accessToken: access_token, expiresAt: expires_at } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    return res.status(200).json({
      session: {
        access_token,
        expires_at,
        user
      },
      user
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout user
router.post('/logout', async (req: Request, res: Response) => {
  try {
    // In a real app, we would invalidate the tokens in our database
    // For demo purposes, we'll just return success
    
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const decoded = verifyToken(token);
    
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
