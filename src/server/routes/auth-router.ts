
import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateTokens, verifyToken, UserWithRole } from '../utils/auth-utils';

const router = express.Router();

// Mock user database (should be replaced with an actual database)
const users: UserWithRole[] = [];

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: UserWithRole = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role: 'customer', // Default role
      created_at: new Date(),
      updated_at: new Date()
    };

    // Save user to database
    users.push(newUser);

    // Return success response without tokens
    return res.status(201).json({ 
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    // Generate tokens
    const { accessToken, expiresAt } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return tokens and user info
    return res.status(200).json({
      session: {
        access_token: accessToken,
        expires_at: expiresAt,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.email.split('@')[0] // Placeholder for full_name
        }
      },
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user by id
    const user = users.find(user => user.id === decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout user (for session management - doesn't invalidate token in this implementation)
router.post('/logout', async (req, res) => {
  // In a real implementation, you would track and blacklist tokens
  // For now, we just return a success response
  return res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
