
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock business inquiries database
const inquiries: any[] = [];

// Submit business inquiry
router.post('/inquiry', async (req, res) => {
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
        error: 'Business name, contact person, email, and inquiry are required' 
      });
    }

    // Create new inquiry
    const newInquiry = {
      id: uuidv4(),
      businessName,
      contactPerson,
      email,
      phone: phone || null,
      inquiry,
      additionalInfo: additionalInfo || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save inquiry to database
    inquiries.push(newInquiry);

    // In a real implementation, you might send an email notification here
    // using emailService.sendBusinessInquiryNotification(...)

    return res.status(201).json({
      message: 'Business inquiry submitted successfully',
      inquiry: newInquiry
    });
  } catch (error) {
    console.error('Business inquiry error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit consultation request
router.post('/consultation-request', async (req, res) => {
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
        error: 'Business name, contact person, email, and product interest are required' 
      });
    }

    // Create new consultation request
    const newRequest = {
      id: uuidv4(),
      businessName,
      contactPerson,
      email,
      phone: phone || null,
      productInterest,
      estimatedQuantity: estimatedQuantity || null,
      preferredDate: preferredDate || null,
      additionalInfo: additionalInfo || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real implementation, you would save this to a database
    // and send an email notification using emailService.sendConsultationRequestNotification(...)

    return res.status(201).json({
      message: 'Consultation request submitted successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Consultation request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
