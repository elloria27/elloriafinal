
import nodemailer from 'nodemailer';

// Configure email transport (replace with actual SMTP credentials in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@example.com';

// Email service for sending various types of emails
export const emailService = {
  /**
   * Send contact form email
   */
  async sendContactEmail(params: {
    name: string;
    email: string;
    message: string;
    subject?: string;
  }): Promise<void> {
    const { name, email, message, subject } = params;
    
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: subject || 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
  },

  /**
   * Send order status update email
   */
  async sendOrderStatusEmail(params: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    newStatus: string;
    orderItems?: Array<{ name: string; quantity: number; price: number }>;
    orderTotal?: number;
    currency?: string;
    lang?: 'en' | 'uk';
  }): Promise<void> {
    const {
      orderNumber,
      customerName,
      customerEmail,
      newStatus,
      orderItems = [],
      orderTotal = 0,
      currency = 'USD',
      lang = 'en',
    } = params;

    const subject = lang === 'uk'
      ? `Замовлення ${orderNumber} - статус оновлено до "${newStatus}"`
      : `Order ${orderNumber} - Status Updated to "${newStatus}"`;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject,
      html: `
        <h1>${lang === 'uk' ? 'Оновлення статусу замовлення' : 'Order Status Update'}</h1>
        <p>${lang === 'uk' ? 'Шановний(а)' : 'Dear'} ${customerName},</p>
        <p>${lang === 'uk' 
          ? `Ваше замовлення №${orderNumber} тепер має статус "${newStatus}".` 
          : `Your order #${orderNumber} has been updated to status "${newStatus}".`}</p>
        ${orderItems.length > 0 ? `
          <h2>${lang === 'uk' ? 'Деталі замовлення' : 'Order Details'}</h2>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr>
              <th>${lang === 'uk' ? 'Товар' : 'Item'}</th>
              <th>${lang === 'uk' ? 'Кількість' : 'Quantity'}</th>
              <th>${lang === 'uk' ? 'Ціна' : 'Price'}</th>
            </tr>
            ${orderItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${currency} ${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2"><strong>${lang === 'uk' ? 'Всього' : 'Total'}</strong></td>
              <td><strong>${currency} ${orderTotal.toFixed(2)}</strong></td>
            </tr>
          </table>
        ` : ''}
        <p>${lang === 'uk' 
          ? 'Дякуємо за покупку у нас!' 
          : 'Thank you for shopping with us!'}</p>
      `,
    });
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
  }): Promise<void> {
    const {
      orderNumber,
      customerName,
      customerEmail,
      trackingNumber,
      trackingUrl = '',
      estimatedDelivery = 'Not available',
      carrier = 'Standard Shipping',
      lang = 'en',
    } = params;

    const subject = lang === 'uk'
      ? `Замовлення ${orderNumber} - відправлено`
      : `Order ${orderNumber} - Shipped`;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject,
      html: `
        <h1>${lang === 'uk' ? 'Сповіщення про відправлення' : 'Shipment Notification'}</h1>
        <p>${lang === 'uk' ? 'Шановний(а)' : 'Dear'} ${customerName},</p>
        <p>${lang === 'uk' 
          ? `Ваше замовлення №${orderNumber} було відправлено.` 
          : `Your order #${orderNumber} has been shipped.`}</p>
        <p><strong>${lang === 'uk' ? 'Перевізник' : 'Carrier'}:</strong> ${carrier}</p>
        <p><strong>${lang === 'uk' ? 'Номер для відстеження' : 'Tracking Number'}:</strong> ${trackingNumber}</p>
        ${trackingUrl ? `<p><a href="${trackingUrl}">${lang === 'uk' ? 'Відстежити посилку' : 'Track Package'}</a></p>` : ''}
        <p><strong>${lang === 'uk' ? 'Орієнтовна дата доставки' : 'Estimated Delivery'}:</strong> ${estimatedDelivery}</p>
        <p>${lang === 'uk' 
          ? 'Дякуємо за покупку у нас!' 
          : 'Thank you for shopping with us!'}</p>
      `,
    });
  },

  /**
   * Send business inquiry notification email
   */
  async sendBusinessInquiry(params: {
    businessName: string;
    contactPerson: string;
    email: string;
    phone: string;
    inquiry: string;
    additionalInfo: string;
  }): Promise<void> {
    const {
      businessName,
      contactPerson,
      email,
      phone,
      inquiry,
      additionalInfo,
    } = params;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Business Inquiry from ${businessName}`,
      html: `
        <h1>New Business Inquiry</h1>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Contact Person:</strong> ${contactPerson}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <h2>Inquiry</h2>
        <p>${inquiry}</p>
        <h2>Additional Information</h2>
        <p>${additionalInfo}</p>
      `,
    });
  },

  /**
   * Send consultation request notification email
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
  }): Promise<void> {
    const {
      businessName,
      contactPerson,
      email,
      phone,
      productInterest,
      estimatedQuantity,
      preferredDate,
      additionalInfo,
    } = params;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Consultation Request from ${businessName}`,
      html: `
        <h1>New Consultation Request</h1>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Contact Person:</strong> ${contactPerson}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Product Interest:</strong> ${productInterest}</p>
        <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <h2>Additional Information</h2>
        <p>${additionalInfo}</p>
      `,
    });
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
  }): Promise<void> {
    const {
      customerEmail,
      customerName,
      orderId,
      items,
      total,
      shippingAddress,
    } = params;

    // Send customer confirmation
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: `
        <h1>Thank You for Your Order!</h1>
        <p>Dear ${customerName},</p>
        <p>We've received your order #${orderId} and are processing it now.</p>
        <h2>Order Details</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
          </tr>
        </table>
        <h2>Shipping Address</h2>
        <p>${shippingAddress.address}</p>
        <p>${shippingAddress.region}, ${shippingAddress.country}</p>
        <p>You will receive another email when your order ships.</p>
        <p>Thank you for shopping with us!</p>
      `,
    });

    // Send admin notification
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order #${orderId}`,
      html: `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <h2>Order Details</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
          </tr>
        </table>
        <h2>Shipping Address</h2>
        <p>${shippingAddress.address}</p>
        <p>${shippingAddress.region}, ${shippingAddress.country}</p>
      `,
    });
  }
};
