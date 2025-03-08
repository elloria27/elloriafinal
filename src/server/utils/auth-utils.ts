
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserWithRole } from '../models/user';

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-replace-in-production';

// Type definition for JWT payload
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Generate JWT token
export const generateJWT = (user: UserWithRole): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token
export const verifyJWT = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify token
    const decoded = verifyJWT(token);
    
    // Attach user info to request object
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Check if user has admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // First check if user is authenticated
    requireAuth(req, res, () => {
      // Check if user has admin role
      const user = (req as any).user;
      if (user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }
      
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
