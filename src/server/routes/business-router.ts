
import express, { Request, Response } from 'express';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

// Handle business inquiry submissions
router.post('/business-inquiry', async (req: Request, res: Response) => {
  try {
    const { fullName, email, companyName, inquiryType, message } = req.body;
    
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Send email notification
    await sendEmail({
      from: 'noreply@yourdomain.com',
      to: [{ email: 'admin@yourdomain.com' }],
      subject: `New Business Inquiry: ${inquiryType || 'General'}`,
      html: `
        <h2>New Business Inquiry</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${companyName || 'Not provided'}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType || 'General'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    
    return res.status(200).json({ success: true, message: 'Your inquiry has been received.' });
  } catch (error) {
    console.error('Business inquiry error:', error);
    return res.status(500).json({ error: 'Failed to submit business inquiry' });
  }
});

// Handle sustainability program registrations
router.post('/sustainability-registration', async (req: Request, res: Response) => {
  try {
    const { fullName, email, companyName, message } = req.body;
    
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Send email notification
    await sendEmail({
      from: 'sustainability@yourdomain.com',
      to: [{ email: 'admin@yourdomain.com' }],
      subject: 'New Sustainability Program Registration',
      html: `
        <h2>New Sustainability Program Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${companyName || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
      `,
    });
    
    return res.status(200).json({ success: true, message: 'Your registration has been received.' });
  } catch (error) {
    console.error('Sustainability registration error:', error);
    return res.status(500).json({ error: 'Failed to submit registration' });
  }
});

export default router;
