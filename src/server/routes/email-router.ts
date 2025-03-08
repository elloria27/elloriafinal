
import express, { Request, Response } from 'express';
import { sendContactEmail, sendSubscriptionEmail, sendOrderStatusEmail } from '../utils/emailService';

const router = express.Router();

// Contact form submission endpoint
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Send contact email
    await sendContactEmail(name, email, message);

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// Newsletter subscription endpoint
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Send subscription confirmation email
    await sendSubscriptionEmail(email, name);

    return res.status(200).json({
      success: true,
      message: 'Subscription successful'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process subscription'
    });
  }
});

// Order status update email endpoint
router.post('/order-status', async (req: Request, res: Response) => {
  try {
    const { customerEmail, customerName, orderId, status } = req.body;

    // Validate required fields
    if (!customerEmail || !orderId || !status) {
      return res.status(400).json({ error: 'Customer email, order ID, and status are required' });
    }

    // Send order status update email
    await sendOrderStatusEmail(
      customerEmail,
      customerName || 'Valued Customer',
      orderId,
      status
    );

    return res.status(200).json({
      success: true,
      message: 'Order status email sent successfully'
    });
  } catch (error) {
    console.error('Order status email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send order status email'
    });
  }
});

export default router;
