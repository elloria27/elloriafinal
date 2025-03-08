
import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string;
  }[];
}

// Create a transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<any> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: options.from,
      to: options.to.join(','),
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendContactEmail = async (
  name: string,
  email: string,
  message: string
): Promise<any> => {
  return sendEmail({
    from: 'noreply@example.com',
    to: ['admin@example.com'],
    subject: 'New Contact Form Submission',
    html: `
      <h1>New Contact Message</h1>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
};

export const sendOrderStatusEmail = async (
  customerEmail: string,
  customerName: string,
  orderId: string,
  status: string
): Promise<any> => {
  return sendEmail({
    from: 'orders@example.com',
    to: [customerEmail],
    subject: `Order ${orderId} Status Update: ${status}`,
    html: `
      <h1>Order Status Update</h1>
      <p>Hello ${customerName},</p>
      <p>Your order #${orderId} has been updated to: <strong>${status}</strong>.</p>
      <p>Thank you for shopping with us!</p>
    `,
  });
};

export const sendBusinessInquiryEmail = async (
  name: string,
  email: string,
  company: string,
  phone: string,
  inquiryType: string,
  message: string
): Promise<any> => {
  return sendEmail({
    from: 'business@example.com',
    to: ['sales@example.com'],
    subject: `New Business Inquiry: ${inquiryType}`,
    html: `
      <h1>New Business Inquiry</h1>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
};

export const sendSubscriptionEmail = async (
  email: string,
  name?: string
): Promise<any> => {
  return sendEmail({
    from: 'newsletter@example.com',
    to: [email],
    subject: 'Welcome to Our Newsletter!',
    html: `
      <h1>Thank You for Subscribing!</h1>
      <p>Hello ${name || 'there'},</p>
      <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest products and offers.</p>
      <p>If you didn't subscribe, please ignore this email or contact us to be removed from our list.</p>
    `,
  });
};
