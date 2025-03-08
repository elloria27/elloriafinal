
import express, { Request, Response } from 'express';
import { emailService } from '../../utils/emailService';

const router = express.Router();

// Send contact form email
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message, subject } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, message'
      });
    }
    
    // Send email
    await emailService.sendContactEmail({
      name,
      email,
      message,
      subject: subject || 'Contact Form Submission'
    });
    
    return res.status(200).json({
      message: 'Contact email sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({ error: 'Failed to send contact email' });
  }
});

// Send order status email
router.post('/order-status', async (req: Request, res: Response) => {
  try {
    const {
      orderNumber,
      customerName,
      customerEmail,
      newStatus,
      orderItems,
      orderTotal,
      currency,
      lang
    } = req.body;
    
    if (!orderNumber || !customerName || !customerEmail || !newStatus) {
      return res.status(400).json({
        error: 'Missing required fields: orderNumber, customerName, customerEmail, newStatus'
      });
    }
    
    // Send email
    await emailService.sendOrderStatusEmail({
      orderNumber,
      customerName,
      customerEmail,
      newStatus,
      orderItems: orderItems || [],
      orderTotal: orderTotal || 0,
      currency: currency || 'USD',
      lang: lang || 'en'
    });
    
    return res.status(200).json({
      message: 'Order status email sent successfully'
    });
  } catch (error) {
    console.error('Error sending order status email:', error);
    return res.status(500).json({ error: 'Failed to send order status email' });
  }
});

// Send shipment notification email
router.post('/shipment-notification', async (req: Request, res: Response) => {
  try {
    const {
      orderNumber,
      customerName,
      customerEmail,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      carrier,
      lang
    } = req.body;
    
    if (!orderNumber || !customerName || !customerEmail || !trackingNumber) {
      return res.status(400).json({
        error: 'Missing required fields: orderNumber, customerName, customerEmail, trackingNumber'
      });
    }
    
    // Send email
    await emailService.sendShipmentNotificationEmail({
      orderNumber,
      customerName,
      customerEmail,
      trackingNumber,
      trackingUrl: trackingUrl || '',
      estimatedDelivery: estimatedDelivery || 'Not available',
      carrier: carrier || 'Standard Shipping',
      lang: lang || 'en'
    });
    
    return res.status(200).json({
      message: 'Shipment notification email sent successfully'
    });
  } catch (error) {
    console.error('Error sending shipment notification email:', error);
    return res.status(500).json({ error: 'Failed to send shipment notification email' });
  }
});

// Send order confirmation emails
router.post('/order-confirmation', async (req: Request, res: Response) => {
  try {
    const {
      customerEmail,
      customerName,
      orderId,
      items,
      total,
      shippingAddress
    } = req.body;
    
    if (!customerEmail || !customerName || !orderId || !items || !total || !shippingAddress) {
      return res.status(400).json({
        error: 'Missing required fields for order confirmation email'
      });
    }
    
    // Send email
    await emailService.sendOrderEmails({
      customerEmail,
      customerName,
      orderId,
      items,
      total,
      shippingAddress
    });
    
    return res.status(200).json({
      message: 'Order confirmation emails sent successfully'
    });
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    return res.status(500).json({ error: 'Failed to send order confirmation emails' });
  }
});

export default router;
