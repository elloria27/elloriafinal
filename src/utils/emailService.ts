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
              <h1>Thank you for your order!</h1>
              <p>Dear ${orderDetails.customerName},</p>
              <p>We've received your order #${orderDetails.orderId}.</p>
              <h2>Order Details:</h2>
              <ul>
                ${orderDetails.items.map(item => `
                  <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
                `).join('')}
              </ul>
              <p><strong>Total: $${orderDetails.total.toFixed(2)}</strong></p>
              <h2>Shipping Address:</h2>
              <p>
                ${orderDetails.shippingAddress.address}<br>
                ${orderDetails.shippingAddress.city ? orderDetails.shippingAddress.city + '<br>' : ''}
                ${orderDetails.shippingAddress.region}<br>
                ${orderDetails.shippingAddress.country}
              </p>
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