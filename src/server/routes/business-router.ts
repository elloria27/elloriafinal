
import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Submit business inquiry
 */
router.post('/inquiry', async (req: Request, res: Response) => {
  try {
    const { 
      businessName, 
      contactPerson, 
      email, 
      phone, 
      inquiry, 
      additionalInfo 
    } = req.body;

    // Validate required fields
    if (!businessName || !contactPerson || !email || !inquiry) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Save to database
    const { data, error } = await supabase
      .from('business_inquiries')
      .insert([
        { 
          business_name: businessName,
          contact_person: contactPerson,
          email,
          phone,
          inquiry,
          additional_info: additionalInfo
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error saving business inquiry:', error);
      return res.status(500).json({ error: error.message });
    }

    // Return success response
    return res.status(201).json({
      message: 'Business inquiry submitted successfully',
      inquiry: data
    });
  } catch (error: any) {
    console.error('Exception in business inquiry submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Submit consultation request
 */
router.post('/consultation-request', async (req: Request, res: Response) => {
  try {
    const { 
      businessName, 
      contactPerson, 
      email, 
      phone, 
      productInterest, 
      estimatedQuantity,
      preferredDate,
      additionalInfo 
    } = req.body;

    // Validate required fields
    if (!businessName || !contactPerson || !email || !productInterest) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Save to database
    const { data, error } = await supabase
      .from('consultation_requests')
      .insert([
        { 
          business_name: businessName,
          contact_person: contactPerson,
          email,
          phone,
          product_interest: productInterest,
          estimated_quantity: estimatedQuantity,
          preferred_date: preferredDate,
          additional_info: additionalInfo
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error saving consultation request:', error);
      return res.status(500).json({ error: error.message });
    }

    // Return success response
    return res.status(201).json({
      message: 'Consultation request submitted successfully',
      request: data
    });
  } catch (error: any) {
    console.error('Exception in consultation request submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
