
// Email service for sending various types of emails
// For a real implementation, you'd likely use nodemailer or a service like SendGrid

// Simple mock implementation for demo purposes
export const emailService = {
  /**
   * Send contact form email
   */
  async sendContactEmail(params: {
    name: string;
    email: string;
    message: string;
    subject: string;
  }): Promise<void> {
    console.log('Sending contact email:', params);
    // In a real implementation, you would send an actual email here
    return Promise.resolve();
  },

  /**
   * Send order status update email
   */
  async sendOrderStatusEmail(params: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    newStatus: string;
    orderItems: Array<{ name: string; quantity: number; price: number }>;
    orderTotal: number;
    currency: string;
    lang: 'en' | 'uk';
  }): Promise<void> {
    console.log('Sending order status email:', params);
    // In a real implementation, you would send an actual email here
    return Promise.resolve();
  },

  /**
   * Send shipment notification email
   */
  async sendShipmentNotificationEmail(params: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    trackingNumber: string;
    trackingUrl: string;
    estimatedDelivery: string;
    carrier: string;
    lang: 'en' | 'uk';
  }): Promise<void> {
    console.log('Sending shipment notification email:', params);
    // In a real implementation, you would send an actual email here
    return Promise.resolve();
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
    console.log('Sending order confirmation email:', params);
    // In a real implementation, you would send an actual email here
    return Promise.resolve();
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
  }): Promise<void> {
    console.log('Sending business inquiry notification:', params);
    // In a real implementation, you would send an actual email here
    return Promise.resolve();
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
  }): Promise<void> {
    console.log('Sending consultation request notification:', params);
    // In a real implementation, you would send an actual email here
    return Promise.resolve();
  }
};
