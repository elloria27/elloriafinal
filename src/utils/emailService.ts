import { CartItem } from "@/contexts/CartContext";

interface OrderEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    address: string;
    city?: string;
    region: string;
    country: string;
  };
}

export const sendOrderEmails = async (orderDetails: OrderEmailDetails) => {
  console.log('Attempting to send order confirmation emails');
  
  const ADMIN_EMAIL = 'sales@elloria.ca';
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: orderDetails.customerEmail }],
            subject: `Order Confirmation - #${orderDetails.orderId}`,
          },
          {
            to: [{ email: ADMIN_EMAIL }],
            subject: `New Order Received - #${orderDetails.orderId}`,
          }
        ],
        from: { email: 'noreply@elloria.ca', name: 'Elloria' },
        content: [
          {
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: right; color: #666;">
                  <p>Order #${orderDetails.orderId}</p>
                  <p>${new Date().toLocaleDateString()}</p>
                </div>

                <div style="margin: 30px 0;">
                  <p>Dear ${orderDetails.customerName},</p>
                  
                  <p>Thank you for choosing Elloria. We are writing to confirm that we have received your order and are delighted to process it for you.</p>
                  
                  <p>Below are the details of your purchase:</p>
                  
                  <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <h3 style="color: #333; margin-bottom: 15px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <thead>
                        <tr style="border-bottom: 1px solid #ddd;">
                          <th style="text-align: left; padding: 8px;">Item</th>
                          <th style="text-align: center; padding: 8px;">Quantity</th>
                          <th style="text-align: right; padding: 8px;">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${orderDetails.items.map(item => `
                          <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px;">${item.name}</td>
                            <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                            <td style="text-align: right; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        `).join('')}
                        <tr>
                          <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
                          <td style="text-align: right; padding: 8px; font-weight: bold;">$${orderDetails.total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style="margin: 20px 0;">
                    <h3 style="color: #333;">Shipping Address:</h3>
                    <p style="margin: 10px 0;">
                      ${orderDetails.shippingAddress.address}<br>
                      ${orderDetails.shippingAddress.city ? orderDetails.shippingAddress.city + '<br>' : ''}
                      ${orderDetails.shippingAddress.region}<br>
                      ${orderDetails.shippingAddress.country}
                    </p>
                  </div>

                  <p>We will process your order promptly and notify you once it has been shipped. If you have any questions about your order, please don't hesitate to contact our customer service team.</p>

                  <p>Best regards,<br>The Elloria Team</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                  <p>This is an automated message, please do not reply to this email. For any inquiries, please contact us at support@elloria.ca</p>
                </div>
              </div>
            `
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    console.log('Order confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    throw error;
  }
};