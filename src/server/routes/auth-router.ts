
import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });

    if (error) {
      console.error('Error registering user:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ 
      message: 'User registered successfully',
      user: data.user
    });
  } catch (error: any) {
    console.error('Exception in register:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

/**
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error logging in:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ 
      message: 'Login successful',
      session: data.session,
      user: data.user
    });
  } catch (error: any) {
    console.error('Exception in login:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

/**
 * Verify user auth token
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({ user: data.user });
  } catch (error: any) {
    console.error('Exception in verify:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Logout user
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    console.error('Exception in logout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
