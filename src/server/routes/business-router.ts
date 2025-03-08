
import express, { Request, Response } from 'express';
import { emailService } from '../utils/emailService';

const router = express.Router();

// Submit business inquiry
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
    
    if (!businessName || !contactPerson || !email || !inquiry) {
      return res.status(400).json({
        error: 'Missing required fields: businessName, contactPerson, email, inquiry'
      });
    }
    
    // In a real app, we would save the inquiry to a database
    // and send an email notification
    
    // Send notification email
    await emailService.sendBusinessInquiry({
      businessName,
      contactPerson,
      email,
      phone: phone || 'Not provided',
      inquiry,
      additionalInfo: additionalInfo || 'Not provided'
    });
    
    return res.status(200).json({
      message: 'Business inquiry submitted successfully',
      inquiryId: 'inq-' + Math.random().toString(36).substr(2, 9)
    });
  } catch (error) {
    console.error('Error submitting business inquiry:', error);
    return res.status(500).json({ error: 'Failed to submit business inquiry' });
  }
});

// Submit consultation request
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
    
    if (!businessName || !contactPerson || !email || !productInterest) {
      return res.status(400).json({
        error: 'Missing required fields: businessName, contactPerson, email, productInterest'
      });
    }
    
    // In a real app, we would save the consultation request to a database
    // and send an email notification
    
    // Send notification email
    await emailService.sendConsultationRequest({
      businessName,
      contactPerson,
      email,
      phone: phone || 'Not provided',
      productInterest,
      estimatedQuantity: estimatedQuantity || 'Not specified',
      preferredDate: preferredDate || 'Not specified',
      additionalInfo: additionalInfo || 'Not provided'
    });
    
    return res.status(200).json({
      message: 'Consultation request submitted successfully',
      requestId: 'req-' + Math.random().toString(36).substr(2, 9)
    });
  } catch (error) {
    console.error('Error submitting consultation request:', error);
    return res.status(500).json({ error: 'Failed to submit consultation request' });
  }
});

export default router;
