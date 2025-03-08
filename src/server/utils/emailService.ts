
import nodemailer from 'nodemailer';

// Create a test SMTP transporter for development
// In production, you would use your real email service configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password'
  }
});

export const emailService = {
  /**
   * Send contact form email
   */
  async sendContactEmail(params: {
    name: string;
    email: string;
    message: string;
    subject?: string;
  }) {
    const { name, email, message, subject } = params;
    
    // In a real app, we would actually send an email here
    console.log('Sending contact email:', { name, email, message, subject });
    
    // For development, just log the email content
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  },
  
  /**
   * Send order status update email
   */
  async sendOrderStatusEmail(params: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    newStatus: string;
    orderItems?: Array<{ name: string; quantity: number; price: number; }>;
    orderTotal?: number;
    currency?: string;
    lang?: 'en' | 'uk';
  }) {
    // In a real app, we would actually send an email here
    console.log('Sending order status email:', params);
    
    // For development, just log the email content
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  },
  
  /**
   * Send shipment notification email
   */
  async sendShipmentNotificationEmail(params: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    trackingNumber: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    carrier?: string;
    lang?: 'en' | 'uk';
  }) {
    // In a real app, we would actually send an email here
    console.log('Sending shipment notification email:', params);
    
    // For development, just log the email content
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  },
  
  /**
   * Send order confirmation emails
   */
  async sendOrderEmails(params: {
    customerEmail: string;
    customerName: string;
    orderId: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    total: number;
    shippingAddress: {
      address: string;
      region: string;
      country: string;
    };
  }) {
    // In a real app, we would actually send an email here
    console.log('Sending order confirmation email:', params);
    
    // For development, just log the email content
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  },
  
  /**
   * Send business inquiry notification
   */
  async sendBusinessInquiry(params: {
    businessName: string;
    contactPerson: string;
    email: string;
    phone: string;
    inquiry: string;
    additionalInfo: string;
  }) {
    // In a real app, we would actually send an email here
    console.log('Sending business inquiry notification:', params);
    
    // For development, just log the email content
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  },
  
  /**
   * Send consultation request notification
   */
  async sendConsultationRequest(params: {
    businessName: string;
    contactPerson: string;
    email: string;
    phone: string;
    productInterest: string;
    estimatedQuantity: string;
    preferredDate: string;
    additionalInfo: string;
  }) {
    // In a real app, we would actually send an email here
    console.log('Sending consultation request notification:', params);
    
    // For development, just log the email content
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  }
};
