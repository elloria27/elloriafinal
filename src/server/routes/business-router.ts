
import express, { Request, Response } from 'express';
import { sendBusinessInquiryEmail } from '../utils/emailService';

const router = express.Router();

// Business inquiry endpoint
router.post('/inquiries', async (req: Request, res: Response) => {
  try {
    const { name, email, company, phone, inquiryType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Send business inquiry email
    await sendBusinessInquiryEmail(
      name,
      email,
      company || 'Not provided',
      phone || 'Not provided',
      inquiryType || 'General Inquiry',
      message
    );

    return res.status(200).json({
      success: true,
      message: 'Business inquiry submitted successfully'
    });
  } catch (error) {
    console.error('Business inquiry error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit business inquiry'
    });
  }
});

// Sustainability program registration endpoint
router.post('/sustainability-registration', async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      company, 
      phone, 
      businessType,
      materialInterest,
      heardFrom,
      message 
    } = req.body;

    // Validate required fields
    if (!name || !email || !company) {
      return res.status(400).json({ error: 'Name, email, and company are required' });
    }

    // In a real implementation, you would send this to your email service
    // For now, we'll just log it and return success
    console.log('Sustainability registration:', {
      name,
      email,
      company,
      phone,
      businessType,
      materialInterest,
      heardFrom,
      message
    });

    return res.status(200).json({
      success: true,
      message: 'Sustainability program registration submitted successfully'
    });
  } catch (error) {
    console.error('Sustainability registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit sustainability program registration'
    });
  }
});

export default router;
