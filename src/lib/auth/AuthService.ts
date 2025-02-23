
import { query, queryOne } from '../db/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

export class AuthService {
  static async signUp(email: string, password: string, fullName?: string): Promise<AuthUser> {
    // Check if user exists
    const existingUser = await queryOne<AuthUser>(
      'SELECT * FROM profiles WHERE email = $1',
      [email]
    );

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in auth schema
    const result = await queryOne<AuthUser>(
      `INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [email, hashedPassword, { full_name: fullName }]
    );

    if (!result) {
      throw new Error('Failed to create user');
    }

    return result;
  }

  static async signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const user = await queryOne<AuthUser & { encrypted_password: string }>(
      `SELECT p.*, u.encrypted_password, r.role
       FROM auth.users u
       JOIN profiles p ON p.id = u.id
       JOIN user_roles r ON r.user_id = u.id
       WHERE u.email = $1`,
      [email]
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.encrypted_password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { encrypted_password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await queryOne<AuthUser>(
        `SELECT p.*, r.role
         FROM profiles p
         JOIN user_roles r ON r.user_id = p.id
         WHERE p.id = $1`,
        [decoded.userId]
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async resetPassword(email: string): Promise<void> {
    const user = await queryOne<{ id: string }>(
      'SELECT id FROM profiles WHERE email = $1',
      [email]
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send reset email with token
    console.log('Reset token:', resetToken);
  }

  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await query(
      'UPDATE auth.users SET encrypted_password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );
  }
}
