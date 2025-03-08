
import { createClient } from '@supabase/supabase-js';

// Email service types
export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 content
}

export interface EmailOptions {
  from?: string;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  lang?: 'en' | 'uk';
}

export interface OrderStatusEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  orderTotal?: number;
  currency?: string;
}

export interface ShipmentNotificationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  carrier?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Localized strings for emails
const translations = {
  orderStatus: {
    en: {
      subject: 'Order Status Update - Order #',
      heading: 'Order Status Update',
      greeting: 'Dear',
      statusText: 'The status of your order #',
      statusChanged: 'has been changed to:',
      orderDetails: 'Your Order',
      item: 'Item',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      questions: 'If you have any questions about your order, please contact our support at',
      thanks: 'Thank you for choosing',
    },
    uk: {
      subject: 'Оновлення статусу замовлення - №',
      heading: 'Оновлення Статусу Замовлення',
      greeting: 'Шановний(а)',
      statusText: 'Статус вашого замовлення №',
      statusChanged: 'змінено на:',
      orderDetails: 'Ваше Замовлення',
      item: 'Товар',
      quantity: 'Кількість',
      price: 'Ціна',
      total: 'Загальна сума:',
      questions: 'Якщо у вас є запитання щодо замовлення, будь ласка, зв\'яжіться з нашою службою підтримки за адресою',
      thanks: 'Дякуємо за вибір',
    }
  },
  shipment: {
    en: {
      subject: 'Your Order Has Been Shipped - Order #',
      heading: 'Your Order Has Been Shipped',
      greeting: 'Dear',
      shipmentText: 'We are pleased to inform you that your order #',
      hasBeenShipped: 'has been shipped.',
      trackingInfo: 'Tracking Information',
      trackingNumber: 'Tracking Number:',
      carrier: 'Carrier:',
      trackPackage: 'Track Your Package',
      estimatedDelivery: 'Estimated Delivery:',
      questions: 'If you have any questions about your shipment, please contact our support at',
      thanks: 'Thank you for choosing',
    },
    uk: {
      subject: 'Ваше замовлення відправлено - №',
      heading: 'Ваше Замовлення Відправлено',
      greeting: 'Шановний(а)',
      shipmentText: 'Раді повідомити, що ваше замовлення №',
      hasBeenShipped: 'було відправлено.',
      trackingInfo: 'Інформація про Відстеження',
      trackingNumber: 'Номер відстеження:',
      carrier: 'Перевізник:',
      trackPackage: 'Відстежити Посилку',
      estimatedDelivery: 'Орієнтовна дата доставки:',
      questions: 'Якщо у вас є запитання щодо відправлення, будь ласка, зв\'яжіться з нашою службою підтримки за адресою',
      thanks: 'Дякуємо за вибір',
    }
  }
};

// Company info for email templates
const companyInfo = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  gst: '742031420RT0001',
  logo: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/logo.png'
};

export class EmailService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabaseClient: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Send email using Supabase Edge Function
   */
  async sendEmail(options: EmailOptions): Promise<ApiResponse> {
    try {
      console.log('Sending email with options:', { ...options, html: '...' });

      // Convert recipients to format expected by edge function
      const toAddresses = options.to.map(recipient => recipient.email);

      const response = await this.supabaseClient.functions.invoke('send-email', {
        body: {
          from: options.from || 'Elloria <notifications@elloria.ca>',
          to: toAddresses,
          subject: options.subject,
          html: options.html,
          attachments: options.attachments || []
        }
      });

      if (response.error) {
        console.error('Error sending email:', response.error);
        return {
          success: false,
          error: response.error
        };
      }

      console.log('Email sent successfully:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Exception sending email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusEmail(params: OrderStatusEmailParams): Promise<ApiResponse> {
    const lang = params.lang || 'uk';
    const text = translations.orderStatus[lang === 'en' ? 'en' : 'uk'];
    const statusColor = this.getStatusColor(params.newStatus);
    
    // Generate HTML template with updated status
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${companyInfo.logo}" alt="${companyInfo.name}" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 20px;">${text.heading}</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 10px;">${text.greeting} ${params.customerName},</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            ${text.statusText}${params.orderNumber} ${text.statusChanged} 
            <span style="display: inline-block; background-color: ${statusColor}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">${this.getStatusText(params.newStatus, lang)}</span>
          </p>

          ${params.orderItems ? `
          <div style="margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">${text.orderDetails}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f1f1;">
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${text.item}</th>
                  <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${text.quantity}</th>
                  <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${text.price}</th>
                </tr>
              </thead>
              <tbody>
                ${params.orderItems.map(item => `
                  <tr>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${item.price} ${params.currency || 'CAD'}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">${text.total}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold;">${params.orderTotal} ${params.currency || 'CAD'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">
            ${text.questions} 
            <a href="mailto:${companyInfo.email}" style="color: #0094F4; text-decoration: none;">${companyInfo.email}</a>
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            ${text.thanks} ${companyInfo.name}!
          </p>
        </div>
      </div>
    `;

    // Send the email
    return this.sendEmail({
      to: [{ email: params.customerEmail, name: params.customerName }],
      subject: `${text.subject}${params.orderNumber}`,
      html: emailHtml,
      lang
    });
  }

  /**
   * Send shipment notification email
   */
  async sendShipmentNotificationEmail(params: ShipmentNotificationParams): Promise<ApiResponse> {
    const lang = params.lang || 'uk';
    const text = translations.shipment[lang === 'en' ? 'en' : 'uk'];
    
    // Generate HTML template with tracking information
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${companyInfo.logo}" alt="${companyInfo.name}" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 20px;">${text.heading}</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 10px;">${text.greeting} ${params.customerName},</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            ${text.shipmentText}${params.orderNumber} ${text.hasBeenShipped}
          </p>

          <div style="background-color: #e9f7fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">${text.trackingInfo}</h3>
            <p style="margin: 5px 0;"><strong>${text.trackingNumber}</strong> ${params.trackingNumber}</p>
            ${params.carrier ? `<p style="margin: 5px 0;"><strong>${text.carrier}</strong> ${params.carrier}</p>` : ''}
            ${params.estimatedDelivery ? `<p style="margin: 5px 0;"><strong>${text.estimatedDelivery}</strong> ${params.estimatedDelivery}</p>` : ''}
            ${params.trackingUrl ? `
              <div style="margin-top: 15px;">
                <a href="${params.trackingUrl}" target="_blank" style="display: inline-block; background-color: #0094F4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px; font-weight: bold;">${text.trackPackage}</a>
              </div>
            ` : ''}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">
            ${text.questions} 
            <a href="mailto:${companyInfo.email}" style="color: #0094F4; text-decoration: none;">${companyInfo.email}</a>
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            ${text.thanks} ${companyInfo.name}!
          </p>
        </div>
      </div>
    `;

    // Send the email
    return this.sendEmail({
      to: [{ email: params.customerEmail, name: params.customerName }],
      subject: `${text.subject}${params.orderNumber}`,
      html: emailHtml,
      lang
    });
  }

  /**
   * Helper method to get color for status
   */
  private getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'pending': '#FFA500',    // Orange
      'processing': '#2196F3', // Blue
      'shipped': '#4CAF50',    // Green
      'delivered': '#8BC34A',  // Light Green
      'cancelled': '#F44336',  // Red
      'refunded': '#9C27B0',   // Purple
      'paid': '#4CAF50'        // Green
    };
    
    return colorMap[status] || '#757575'; // Default gray
  }

  /**
   * Helper method to get localized status text
   */
  private getStatusText(status: string, lang: string = 'uk'): string {
    const statusMap: Record<string, Record<string, string>> = {
      en: {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'refunded': 'Refunded',
        'paid': 'Paid'
      },
      uk: {
        'pending': 'В обробці',
        'processing': 'Обробляється',
        'shipped': 'Відправлено',
        'delivered': 'Доставлено',
        'cancelled': 'Скасовано',
        'refunded': 'Повернуто',
        'paid': 'Оплачено'
      }
    };
    
    return statusMap[lang === 'en' ? 'en' : 'uk'][status] || status;
  }
}
