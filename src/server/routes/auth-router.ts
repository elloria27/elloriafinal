
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateJWT, verifyJWT, requireAuth } from '../utils/auth-utils';
import { User, UserRole } from '../models/user';

const router = express.Router();

// Sample in-memory user storage (in production, use a real database)
const users: User[] = [];

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      first_name: firstName || '',
      last_name: lastName || '',
      full_name: `${firstName || ''} ${lastName || ''}`.trim(),
      role: 'client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = generateJWT(newUser);

    // Return user info (excluding password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateJWT(user);

    // Return user info (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user endpoint
router.get('/user', requireAuth, async (req: Request, res: Response) => {
  try {
    // Find user by ID (from token payload)
    const userId = (req as any).user.userId;
    const user = users.find(user => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user info (excluding password)
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Update user profile
router.put('/users/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    
    // Check if user is updating their own profile
    if (id !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    
    // Find user
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user data
    const updateData = req.body;
    const allowedFields = ['first_name', 'last_name', 'phone_number', 'address', 'country', 'region', 'language', 'currency'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        (users[userIndex] as any)[field] = updateData[field];
      }
    });
    
    // Update full_name if first_name or last_name changed
    if (updateData.first_name !== undefined || updateData.last_name !== undefined) {
      users[userIndex].full_name = `${users[userIndex].first_name || ''} ${users[userIndex].last_name || ''}`.trim();
    }
    
    users[userIndex].updated_at = new Date().toISOString();
    
    // Return updated user (excluding password)
    const { password, ...userWithoutPassword } = users[userIndex];
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;
