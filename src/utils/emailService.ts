
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
  // For development, we can use a service like Mailtrap
  // In production, use your actual SMTP settings
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
