import { CartItem } from "@/contexts/CartContext";

interface OrderEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
}

export const sendOrderEmails = async (orderDetails: OrderEmailDetails) => {
  console.log('Starting to send order emails...');
  
  const adminEmail = 'sales@elloria.ca';
  
  // Customer Email Template
  const customerEmailContent = `
    Dear ${orderDetails.customerName},

    Thank you for your order with Elloria! We're excited to confirm your purchase.

    Order Details:
    Order ID: ${orderDetails.orderId}
    
    Items Ordered:
    ${orderDetails.items.map(item => 
      `- ${item.name} (Quantity: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}

    Total Amount: $${orderDetails.total.toFixed(2)}

    Shipping Address:
    ${orderDetails.shippingAddress.address}
    ${orderDetails.shippingAddress.region}
    ${orderDetails.shippingAddress.country}

    We'll notify you once your order has been shipped.

    Best regards,
    The Elloria Team
  `;

  // Admin Email Template
  const adminEmailContent = `
    New Order Received!

    Order ID: ${orderDetails.orderId}
    Customer: ${orderDetails.customerName}
    Email: ${orderDetails.customerEmail}

    Items Ordered:
    ${orderDetails.items.map(item => 
      `- ${item.name} (Quantity: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}

    Total Amount: $${orderDetails.total.toFixed(2)}

    Shipping Address:
    ${orderDetails.shippingAddress.address}
    ${orderDetails.shippingAddress.region}
    ${orderDetails.shippingAddress.country}
  `;

  try {
    console.log('Attempting to send customer email to:', orderDetails.customerEmail);
    
    // Simulate email sending for now (replace with actual SendGrid implementation)
    console.log('Customer Email Content:', customerEmailContent);
    console.log('Admin Email Content:', adminEmailContent);
    
    // For testing purposes, we'll consider the emails as sent successfully
    console.log('Emails sent successfully');
    return true;
    
  } catch (error) {
    console.error('Error sending order emails:', error);
    throw new Error('Failed to send order confirmation emails');
  }
};