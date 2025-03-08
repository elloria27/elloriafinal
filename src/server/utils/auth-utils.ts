
import jwt from 'jsonwebtoken';
import { UserWithRole } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export interface JwtTokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate JWT tokens for user authentication
 */
export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const payload: JwtTokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  // Calculate expiry timestamp
  const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  return {
    accessToken,
    expiresAt
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtTokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
