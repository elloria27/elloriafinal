
import express, { Request, Response } from 'express';
import { sendEmail, sendOrderEmails } from '../utils/emailService';

const router = express.Router();

// Handle contact form submissions
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { fullName, email, subject, message, phone } = req.body;
    
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Send email notification
    await sendEmail({
      from: 'noreply@yourdomain.com',
      to: [{ email: 'admin@yourdomain.com' }],
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    
    return res.status(200).json({ success: true, message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

// Handle newsletter subscriptions
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Send confirmation email
    await sendEmail({
      from: 'newsletter@yourdomain.com',
      to: [{ email }],
      subject: 'Newsletter Subscription Confirmation',
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>You have been added to our newsletter list and will receive updates on our latest products and offers.</p>
        <p>If you did not request this subscription, please ignore this email.</p>
      `,
    });
    
    return res.status(200).json({ success: true, message: 'Successfully subscribed to newsletter.' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ error: 'Failed to process subscription' });
  }
});

// Handle order status notifications
router.post('/order-status', async (req: Request, res: Response) => {
  try {
    const { orderId, customerEmail, customerName, status, trackingNumber } = req.body;
    
    if (!orderId || !customerEmail || !customerName || !status) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Determine email content based on status
    let subject = '';
    let content = '';
    
    switch (status) {
      case 'shipped':
        subject = `Your Order #${orderId} Has Been Shipped`;
        content = `
          <h2>Your Order Has Been Shipped!</h2>
          <p>Dear ${customerName},</p>
          <p>We're pleased to inform you that your order #${orderId} has been shipped.</p>
          ${trackingNumber ? `<p>Your tracking number is: <strong>${trackingNumber}</strong></p>` : ''}
          <p>Thank you for shopping with us!</p>
        `;
        break;
      case 'delivered':
        subject = `Your Order #${orderId} Has Been Delivered`;
        content = `
          <h2>Your Order Has Been Delivered!</h2>
          <p>Dear ${customerName},</p>
          <p>We're pleased to inform you that your order #${orderId} has been delivered.</p>
          <p>We hope you enjoy your purchase! If you have any questions or feedback, feel free to contact us.</p>
          <p>Thank you for shopping with us!</p>
        `;
        break;
      default:
        subject = `Update on Your Order #${orderId}`;
        content = `
          <h2>Order Status Update</h2>
          <p>Dear ${customerName},</p>
          <p>We're writing to inform you that the status of your order #${orderId} has been updated to: <strong>${status}</strong>.</p>
          <p>Thank you for shopping with us!</p>
        `;
    }
    
    // Send email notification
    await sendEmail({
      from: 'orders@yourdomain.com',
      to: [{ email: customerEmail }],
      subject: subject,
      html: content,
    });
    
    return res.status(200).json({ success: true, message: 'Order status notification sent.' });
  } catch (error) {
    console.error('Order status notification error:', error);
    return res.status(500).json({ error: 'Failed to send order status notification' });
  }
});

export default router;
