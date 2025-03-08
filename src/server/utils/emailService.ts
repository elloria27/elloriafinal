
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

interface OrderEmailOptions {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: any[];
  total: number;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
}

export const sendOrderEmails = async (options: OrderEmailOptions): Promise<{ success: boolean; error?: any }> => {
  try {
    // Generate order confirmation email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Dear ${options.customerName},</p>
        <p>Thank you for your order! We're excited to confirm that we've received your order #${options.orderId}.</p>
        
        <h2 style="color: #333; margin-top: 30px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f3f3;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${options.items.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>$${options.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <h2 style="color: #333; margin-top: 30px;">Shipping Address</h2>
        <p>
          ${options.shippingAddress.address}<br>
          ${options.shippingAddress.region}<br>
          ${options.shippingAddress.country}
        </p>
        
        <p style="margin-top: 30px;">
          We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.
        </p>
        
        <p>Thank you for shopping with us!</p>
      </div>
    `;
    
    // Send email to customer
    await sendEmail({
      from: 'noreply@yourdomain.com',
      to: [options.customerEmail],
      subject: `Order Confirmation #${options.orderId}`,
      html: htmlContent,
    });
    
    // You could also send a notification to your team
    // await sendEmail({
    //   from: 'orders@yourdomain.com',
    //   to: ['admin@yourdomain.com'],
    //   subject: `New Order #${options.orderId}`,
    //   html: `New order received from ${options.customerName} for $${options.total.toFixed(2)}.`,
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending order emails:', error);
    return { success: false, error };
  }
};
