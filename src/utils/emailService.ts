
import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments?: any[];
}

// Create reusable transporter using SMTP or other transport methods
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME || 'user@example.com',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create transporter
    const transporter = createTransporter();

    // Send email
    await transporter.sendMail({
      from: options.from,
      to: options.to.join(','),
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send order emails (confirmation, etc.)
export const sendOrderEmails = async (
  orderDetails: any,
  customerEmail: string,
  adminEmails: string[] = ['admin@yourdomain.com']
): Promise<void> => {
  try {
    // Send customer order confirmation
    await sendEmail({
      from: 'orders@yourdomain.com',
      to: [customerEmail],
      subject: `Order Confirmation #${orderDetails.orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>We're processing your order #${orderDetails.orderId}.</p>
        <p>You'll receive another notification when your order ships.</p>
      `,
    });

    // Send admin notification
    await sendEmail({
      from: 'orders@yourdomain.com',
      to: adminEmails,
      subject: `New Order #${orderDetails.orderId}`,
      html: `
        <h2>New Order Received</h2>
        <p>Order ID: ${orderDetails.orderId}</p>
        <p>Customer: ${orderDetails.customerName}</p>
        <p>Email: ${customerEmail}</p>
        <p>Total: ${orderDetails.total}</p>
      `,
    });

    console.log('Order emails sent successfully');
  } catch (error) {
    console.error('Error sending order emails:', error);
    throw error;
  }
};
