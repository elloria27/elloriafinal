
import express from 'express';
import { supabase } from '../../integrations/supabase/client';

const router = express.Router();

// Реєстрація користувача
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
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
      console.error('Error during signup:', error);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: 'Signup successful',
      user: data.user
    });
  } catch (error) {
    console.error('Server error during signup:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Вхід користувача
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error during signin:', error);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: 'Signin successful',
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Server error during signin:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Вихід користувача
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during signout:', error);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ message: 'Signout successful' });
  } catch (error) {
    console.error('Server error during signout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримання користувача за JWT токеном
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Error getting user:', error);
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(200).json({ user: data.user });
  } catch (error) {
    console.error('Server error getting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
