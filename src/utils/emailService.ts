
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface ContactEmailParams {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface OrderStatusEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  orderItems?: Array<{ name: string; quantity: number; price: number; }>;
  orderTotal?: number;
  currency?: string;
  lang?: 'en' | 'uk';
}

interface ShipmentNotificationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  carrier?: string;
  lang?: 'en' | 'uk';
}

interface OrderEmailsParams {
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
}

interface BusinessInquiryParams {
  businessName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  inquiry: string;
  additionalInfo?: string;
}

interface ConsultationRequestParams {
  businessName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  productInterest: string;
  estimatedQuantity?: string;
  preferredDate?: string;
  additionalInfo?: string;
}

/**
 * Email service for sending various types of emails
 */
class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom = 'no-reply@example.com';
  
  constructor() {
    // Create a test account if we're in development mode
    // For production, you would use real SMTP credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password'
      }
    });
  }
  
  /**
   * Common method to send emails
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, html, from } = options;
    
    try {
      await this.transporter.sendMail({
        from: from || this.defaultFrom,
        to,
        subject,
        html
      });
      
      console.log(`Email sent to ${to} with subject ${subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }
  
  /**
   * Send a contact form email
   */
  async sendContactEmail(params: ContactEmailParams): Promise<void> {
    const { name, email, message, subject } = params;
    
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    
    await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: subject || 'New Contact Form Submission',
      html: htmlContent
    });
  }
  
  /**
   * Send an order status update email
   */
  async sendOrderStatusEmail(params: OrderStatusEmailParams): Promise<void> {
    const { 
      orderNumber, 
      customerName, 
      customerEmail, 
      newStatus, 
      orderItems = [], 
      orderTotal = 0, 
      currency = 'USD', 
      lang = 'en' 
    } = params;
    
    const statusText = lang === 'uk' ? 'Статус замовлення' : 'Order Status';
    
    let itemsList = '';
    if (orderItems.length > 0) {
      itemsList = '<ul>' + orderItems.map(item => 
        `<li>${item.name} x ${item.quantity} - ${currency} ${item.price}</li>`
      ).join('') + '</ul>';
    }
    
    const htmlContent = `
      <h2>${lang === 'uk' ? 'Оновлення статусу замовлення' : 'Order Status Update'}</h2>
      <p>${lang === 'uk' ? 'Привіт' : 'Hello'} ${customerName},</p>
      <p>${lang === 'uk' ? 'Ваше замовлення' : 'Your order'} #${orderNumber} ${lang === 'uk' ? 'оновлено до статусу' : 'has been updated to'} <strong>${newStatus}</strong>.</p>
      ${itemsList ? `<h3>${lang === 'uk' ? 'Товари' : 'Items'}:</h3>${itemsList}` : ''}
      ${orderTotal ? `<p><strong>${lang === 'uk' ? 'Загальна сума' : 'Total'}: ${currency} ${orderTotal}</strong></p>` : ''}
      <p>${lang === 'uk' ? 'Дякуємо за ваше замовлення!' : 'Thank you for your order!'}</p>
    `;
    
    await this.sendEmail({
      to: customerEmail,
      subject: `${statusText} #${orderNumber}: ${newStatus}`,
      html: htmlContent
    });
  }
  
  /**
   * Send a shipment notification email
   */
  async sendShipmentNotificationEmail(params: ShipmentNotificationParams): Promise<void> {
    const {
      orderNumber,
      customerName,
      customerEmail,
      trackingNumber,
      trackingUrl = '',
      estimatedDelivery = 'Not available',
      carrier = 'Standard Shipping',
      lang = 'en'
    } = params;
    
    const shipmentText = lang === 'uk' ? 'Відправлення замовлення' : 'Order Shipment';
    
    const htmlContent = `
      <h2>${lang === 'uk' ? 'Ваше замовлення відправлено' : 'Your Order Has Been Shipped'}</h2>
      <p>${lang === 'uk' ? 'Привіт' : 'Hello'} ${customerName},</p>
      <p>${lang === 'uk' ? 'Ваше замовлення' : 'Your order'} #${orderNumber} ${lang === 'uk' ? 'було відправлено через' : 'has been shipped via'} ${carrier}.</p>
      <p><strong>${lang === 'uk' ? 'Номер відстеження' : 'Tracking Number'}:</strong> ${trackingNumber}</p>
      ${trackingUrl ? `<p><a href="${trackingUrl}" target="_blank">${lang === 'uk' ? 'Відстежити відправлення' : 'Track your package'}</a></p>` : ''}
      <p><strong>${lang === 'uk' ? 'Орієнтовна дата доставки' : 'Estimated Delivery'}:</strong> ${estimatedDelivery}</p>
      <p>${lang === 'uk' ? 'Дякуємо за ваше замовлення!' : 'Thank you for your order!'}</p>
    `;
    
    await this.sendEmail({
      to: customerEmail,
      subject: `${shipmentText} #${orderNumber}`,
      html: htmlContent
    });
  }
  
  /**
   * Send order confirmation emails to customer and admin
   */
  async sendOrderEmails(params: OrderEmailsParams): Promise<void> {
    const {
      customerEmail,
      customerName,
      orderId,
      items,
      total,
      shippingAddress
    } = params;
    
    // Build order summary for email
    const itemsList = items.map(item => 
      `<tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');
    
    // Customer email
    const customerHtml = `
      <h2>Order Confirmation #${orderId}</h2>
      <p>Hello ${customerName},</p>
      <p>Thank you for your order! We've received your order and are processing it.</p>
      
      <h3>Order Summary:</h3>
      <table border="1" cellpadding="5" cellspacing="0" width="100%">
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
        ${itemsList}
        <tr>
          <td colspan="3"><strong>Total</strong></td>
          <td><strong>$${total.toFixed(2)}</strong></td>
        </tr>
      </table>
      
      <h3>Shipping Address:</h3>
      <p>${shippingAddress.address}, ${shippingAddress.region}, ${shippingAddress.country}</p>
      
      <p>We'll send you another email once your order ships.</p>
      <p>Thank you for shopping with us!</p>
    `;
    
    await this.sendEmail({
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: customerHtml
    });
    
    // Admin notification email
    const adminHtml = `
      <h2>New Order #${orderId}</h2>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
      
      <h3>Order Details:</h3>
      <table border="1" cellpadding="5" cellspacing="0" width="100%">
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
        ${itemsList}
        <tr>
          <td colspan="3"><strong>Total</strong></td>
          <td><strong>$${total.toFixed(2)}</strong></td>
        </tr>
      </table>
      
      <h3>Shipping Address:</h3>
      <p>${shippingAddress.address}, ${shippingAddress.region}, ${shippingAddress.country}</p>
    `;
    
    await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `New Order #${orderId}`,
      html: adminHtml
    });
  }
  
  /**
   * Send business inquiry notification email
   */
  async sendBusinessInquiry(params: BusinessInquiryParams): Promise<void> {
    const {
      businessName,
      contactPerson,
      email,
      phone = 'Not provided',
      inquiry,
      additionalInfo = 'None'
    } = params;
    
    const htmlContent = `
      <h2>New Business Inquiry</h2>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Contact Person:</strong> ${contactPerson}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Inquiry:</strong></p>
      <p>${inquiry}</p>
      <p><strong>Additional Information:</strong></p>
      <p>${additionalInfo}</p>
    `;
    
    await this.sendEmail({
      to: process.env.BUSINESS_EMAIL || process.env.ADMIN_EMAIL || 'business@example.com',
      subject: `Business Inquiry from ${businessName}`,
      html: htmlContent
    });
  }
  
  /**
   * Send consultation request notification email
   */
  async sendConsultationRequest(params: ConsultationRequestParams): Promise<void> {
    const {
      businessName,
      contactPerson,
      email,
      phone = 'Not provided',
      productInterest,
      estimatedQuantity = 'Not specified',
      preferredDate = 'Not specified',
      additionalInfo = 'None'
    } = params;
    
    const htmlContent = `
      <h2>New Consultation Request</h2>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Contact Person:</strong> ${contactPerson}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Product Interest:</strong> ${productInterest}</p>
      <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
      <p><strong>Preferred Date:</strong> ${preferredDate}</p>
      <p><strong>Additional Information:</strong></p>
      <p>${additionalInfo}</p>
    `;
    
    await this.sendEmail({
      to: process.env.BUSINESS_EMAIL || process.env.ADMIN_EMAIL || 'business@example.com',
      subject: `Consultation Request from ${businessName}`,
      html: htmlContent
    });
  }
}

// Export a singleton instance of the service
export const emailService = new EmailService();

// Export the types for use in other files
export type {
  ContactEmailParams,
  OrderStatusEmailParams,
  ShipmentNotificationParams,
  OrderEmailsParams,
  BusinessInquiryParams,
  ConsultationRequestParams
};
