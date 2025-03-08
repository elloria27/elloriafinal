
import express from 'express';
import { Request, Response } from 'express';
import { User } from '../models/user';
import { generateJWT, verifyJWT } from '../utils/auth-utils';

const router = express.Router();

// Sign up - Register a new user
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user
    const newUser = await User.create({
      email,
      password, // Will be hashed in the model
      full_name: full_name || null,
      role: 'customer',
      email_confirmed: true // For simplicity in this example; in production, implement email verification
    });

    // Generate JWT token
    const token = generateJWT(newUser);

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.full_name,
      },
    });
  } catch (error) {
    console.error('Error in sign up:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Sign in - Log in an existing user
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Validate password
    const isPasswordValid = await User.validatePassword(user.id, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check if email is confirmed (if we implement email verification)
    if (!user.email_confirmed) {
      return res.status(401).json({ error: 'Email not confirmed' });
    }

    // Generate JWT token
    const token = generateJWT(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Error in sign in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
router.get('/user', async (req: Request, res: Response) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const payload = verifyJWT(token);
    
    if (!payload || !payload.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Get user from database
    const user = await User.findById(payload.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Sign out - Log out a user
router.post('/signout', async (req: Request, res: Response) => {
  // With JWT, the client simply discards the token
  // Server-side we don't need to do anything special
  return res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
