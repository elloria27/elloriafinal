
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, always use env variable

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  full_name?: string;
}

// Generate JWT token
export const generateToken = (user: User & { role: UserRole }): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role || 'client',
    full_name: user.full_name
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Alias for compatibility with existing code
export const generateJWT = generateToken;

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Alias for compatibility with existing code
export const verifyJWT = verifyToken;

// Middleware to check if user is authenticated
export const requireAuth = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Add user info to request object
    req.user = payload;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if user has admin role
export const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
};
