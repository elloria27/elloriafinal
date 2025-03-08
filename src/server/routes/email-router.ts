
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock email sending function
const sendEmail = async (to: string, subject: string, html: string) => {
  console.log(`Email sent to ${to} with subject: ${subject}`);
  // In a real implementation, you would use a service like Nodemailer
  return true;
};

// Send contact form email
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }

    // Email to website owner
    await sendEmail(
      'owner@example.com', // Replace with actual recipient
      subject || `New contact form submission from ${name}`,
      `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    );

    // Confirmation email to sender
    await sendEmail(
      email,
      'Thank you for contacting us',
      `
        <h1>Thank you for contacting us!</h1>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Your Company Name</p>
      `
    );

    return res.status(200).json({
      message: 'Contact email sent successfully'
    });
  } catch (error) {
    console.error('Contact email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Send order status update email
router.post('/order-status', async (req, res) => {
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

    // Validate required fields
    if (!orderNumber || !customerName || !customerEmail || !newStatus) {
      return res.status(400).json({ 
        error: 'Order number, customer name, email, and new status are required' 
      });
    }

    // Generate email content based on status
    const subject = `Order #${orderNumber} Update: ${newStatus}`;
    let emailContent = `
      <h1>Order Status Update</h1>
      <p>Dear ${customerName},</p>
      <p>Your order #${orderNumber} has been updated to: <strong>${newStatus}</strong></p>
    `;

    // Add order details if provided
    if (orderItems && orderTotal) {
      emailContent += `
        <h2>Order Summary</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
      `;

      orderItems.forEach(item => {
        emailContent += `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${currency || '$'}${item.price.toFixed(2)}</td>
          </tr>
        `;
      });

      emailContent += `
        <tr>
          <td colspan="2"><strong>Total</strong></td>
          <td><strong>${currency || '$'}${orderTotal.toFixed(2)}</strong></td>
        </tr>
        </table>
      `;
    }

    emailContent += `
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>Your Company Name</p>
    `;

    // Send email
    await sendEmail(customerEmail, subject, emailContent);

    return res.status(200).json({
      message: 'Order status email sent successfully'
    });
  } catch (error) {
    console.error('Order status email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Send shipment notification email
router.post('/shipment-notification', async (req, res) => {
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

    // Validate required fields
    if (!orderNumber || !customerName || !customerEmail || !trackingNumber) {
      return res.status(400).json({ 
        error: 'Order number, customer name, email, and tracking number are required' 
      });
    }

    // Generate email content
    const subject = `Your Order #${orderNumber} Has Shipped`;
    let emailContent = `
      <h1>Shipment Notification</h1>
      <p>Dear ${customerName},</p>
      <p>Great news! Your order #${orderNumber} has been shipped.</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
    `;

    if (trackingUrl) {
      emailContent += `<p><a href="${trackingUrl}">Track your package</a></p>`;
    }

    if (carrier) {
      emailContent += `<p><strong>Carrier:</strong> ${carrier}</p>`;
    }

    if (estimatedDelivery) {
      emailContent += `<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>`;
    }

    emailContent += `
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>Your Company Name</p>
    `;

    // Send email
    await sendEmail(customerEmail, subject, emailContent);

    return res.status(200).json({
      message: 'Shipment notification email sent successfully'
    });
  } catch (error) {
    console.error('Shipment notification email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Send order confirmation emails
router.post('/order-confirmation', async (req, res) => {
  try {
    const { 
      customerEmail, 
      customerName, 
      orderId, 
      items, 
      total, 
      shippingAddress 
    } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !orderId || !items || !total || !shippingAddress) {
      return res.status(400).json({ 
        error: 'Customer email, name, order ID, items, total, and shipping address are required' 
      });
    }

    // Generate customer email content
    const subject = `Order Confirmation #${orderId}`;
    let emailContent = `
      <h1>Thank You for Your Order!</h1>
      <p>Dear ${customerName},</p>
      <p>We're excited to confirm your order #${orderId}.</p>
      
      <h2>Order Summary</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
    `;

    items.forEach(item => {
      emailContent += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
        </tr>
      `;
    });

    emailContent += `
      <tr>
        <td colspan="2"><strong>Total</strong></td>
        <td><strong>$${total.toFixed(2)}</strong></td>
      </tr>
      </table>
      
      <h2>Shipping Address</h2>
      <p>
        ${shippingAddress.address}<br>
        ${shippingAddress.region}<br>
        ${shippingAddress.country}
      </p>
      
      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>Your Company Name</p>
    `;

    // Send customer email
    await sendEmail(customerEmail, subject, emailContent);

    // Send internal notification (to staff)
    await sendEmail(
      'orders@example.com', // Replace with actual staff email
      `New Order #${orderId}`,
      `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p><a href="https://your-admin-panel.com/orders/${orderId}">View order details</a></p>
      `
    );

    return res.status(200).json({
      message: 'Order confirmation emails sent successfully'
    });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
