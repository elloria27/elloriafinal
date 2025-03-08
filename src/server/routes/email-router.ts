
import express, { Request, Response } from 'express';
import { 
  sendEmail, 
  sendOrderStatusEmail, 
  sendShipmentNotificationEmail,
  sendOrderEmails,
  OrderStatusEmailParams,
  ShipmentNotificationParams, 
  OrderEmailsParams
} from '@/utils/emailService';

const router = express.Router();

/**
 * Send contact email
 */
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const result = await sendEmail({
      to: [{ email: 'sales@elloria.ca' }],
      subject: subject || `Contact Form Submission from ${name}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return res.status(200).json({ message: 'Contact email sent successfully' });
  } catch (error: any) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send contact email' });
  }
});

/**
 * Send order status update email
 */
router.post('/order-status', async (req: Request, res: Response) => {
  try {
    const params: OrderStatusEmailParams = req.body;

    if (!params.orderNumber || !params.customerEmail || !params.customerName || !params.newStatus) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await sendOrderStatusEmail(params);

    if (!result.success) {
      throw new Error(result.error);
    }

    return res.status(200).json({ message: 'Order status email sent successfully' });
  } catch (error: any) {
    console.error('Error sending order status email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send order status email' });
  }
});

/**
 * Send shipment notification email
 */
router.post('/shipment-notification', async (req: Request, res: Response) => {
  try {
    const params: ShipmentNotificationParams = req.body;

    if (!params.orderNumber || !params.customerEmail || !params.customerName || !params.trackingNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await sendShipmentNotificationEmail(params);

    if (!result.success) {
      throw new Error(result.error);
    }

    return res.status(200).json({ message: 'Shipment notification email sent successfully' });
  } catch (error: any) {
    console.error('Error sending shipment notification email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send shipment notification email' });
  }
});

/**
 * Send order confirmation emails
 */
router.post('/order-confirmation', async (req: Request, res: Response) => {
  try {
    const params: OrderEmailsParams = req.body;

    if (!params.orderId || !params.customerEmail || !params.customerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await sendOrderEmails(params);

    if (!result.success) {
      throw new Error(result.error);
    }

    return res.status(200).json({ message: 'Order confirmation emails sent successfully' });
  } catch (error: any) {
    console.error('Error sending order confirmation emails:', error);
    return res.status(500).json({ error: error.message || 'Failed to send order confirmation emails' });
  }
});

export default router;
