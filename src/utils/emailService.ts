
import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments?: any[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

// Створення транспортера для SMTP або інших методів відправки
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME || 'user@example.com',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  });
};

/**
 * Відправляє електронний лист з вказаними параметрами
 * @param options Параметри електронного листа
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Створення транспортера
    const transporter = createTransporter();

    // Відправка листа
    await transporter.sendMail({
      from: options.from,
      to: options.to.join(','),
      cc: options.cc?.join(','),
      bcc: options.bcc?.join(','),
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    console.log('Електронний лист успішно відправлено');
  } catch (error) {
    console.error('Помилка відправки електронного листа:', error);
    throw error;
  }
};

/**
 * Відправляє електронні листи для замовлень (підтвердження тощо)
 * @param orderDetails Деталі замовлення
 * @param customerEmail Email клієнта
 * @param adminEmails Список email адміністраторів
 */
export const sendOrderEmails = async (
  orderDetails: any,
  customerEmail: string,
  adminEmails: string[] = ['admin@yourdomain.com']
): Promise<void> => {
  try {
    // Створюємо локалізовані шаблони
    const locale = orderDetails.locale || 'uk'; // Встановлюємо українську як мову за замовчуванням
    
    const translations = {
      uk: {
        customerSubject: `Підтвердження замовлення #${orderDetails.orderId}`,
        customerTitle: 'Дякуємо за ваше замовлення!',
        customerProcessing: `Ми обробляємо ваше замовлення #${orderDetails.orderId}.`,
        customerNotification: 'Ви отримаєте інше повідомлення, коли ваше замовлення буде відправлено.',
        adminSubject: `Нове замовлення #${orderDetails.orderId}`,
        adminTitle: 'Отримано нове замовлення',
        adminOrderId: 'ID замовлення:',
        adminCustomer: 'Клієнт:',
        adminEmail: 'Email:',
        adminTotal: 'Загальна сума:',
        success: 'Електронні листи про замовлення успішно відправлено'
      },
      en: {
        customerSubject: `Order Confirmation #${orderDetails.orderId}`,
        customerTitle: 'Thank you for your order!',
        customerProcessing: `We're processing your order #${orderDetails.orderId}.`,
        customerNotification: 'You'll receive another notification when your order ships.',
        adminSubject: `New Order #${orderDetails.orderId}`,
        adminTitle: 'New Order Received',
        adminOrderId: 'Order ID:',
        adminCustomer: 'Customer:',
        adminEmail: 'Email:',
        adminTotal: 'Total:',
        success: 'Order emails sent successfully'
      }
    };
    
    const t = translations[locale as keyof typeof translations] || translations.en;

    // Відправка підтвердження клієнту
    await sendEmail({
      from: 'orders@yourdomain.com',
      to: [customerEmail],
      subject: t.customerSubject,
      html: `
        <h2>${t.customerTitle}</h2>
        <p>${t.customerProcessing}</p>
        <p>${t.customerNotification}</p>
      `,
    });

    // Відправка сповіщення адміністратору
    await sendEmail({
      from: 'orders@yourdomain.com',
      to: adminEmails,
      subject: t.adminSubject,
      html: `
        <h2>${t.adminTitle}</h2>
        <p>${t.adminOrderId} ${orderDetails.orderId}</p>
        <p>${t.adminCustomer} ${orderDetails.customerName}</p>
        <p>${t.adminEmail} ${customerEmail}</p>
        <p>${t.adminTotal} ${orderDetails.total}</p>
      `,
    });

    console.log(t.success);
  } catch (error) {
    console.error('Помилка відправки листів про замовлення:', error);
    throw error;
  }
};

/**
 * Відправляє листи про оновлення статусу замовлення
 * @param orderDetails Деталі замовлення
 * @param newStatus Новий статус
 */
export const sendOrderStatusUpdateEmails = async (
  orderDetails: any,
  newStatus: string
): Promise<void> => {
  try {
    const locale = orderDetails.locale || 'uk';
    
    const statusTranslations = {
      uk: {
        pending: 'В очікуванні',
        processing: 'В обробці',
        shipped: 'Відправлено',
        delivered: 'Доставлено',
        cancelled: 'Скасовано'
      },
      en: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    };
    
    const translations = {
      uk: {
        subject: `Оновлення статусу замовлення #${orderDetails.orderId}`,
        title: 'Оновлення статусу вашого замовлення',
        status: 'Статус вашого замовлення оновлено:',
        thanks: 'Дякуємо за ваше замовлення!',
        questions: 'Якщо у вас виникли запитання, будь ласка, зв\'яжіться з нами.'
      },
      en: {
        subject: `Order Status Update #${orderDetails.orderId}`,
        title: 'Your Order Status Has Been Updated',
        status: 'Your order status has been updated to:',
        thanks: 'Thank you for your order!',
        questions: 'If you have any questions, please contact us.'
      }
    };
    
    const t = translations[locale as keyof typeof translations] || translations.en;
    const statusText = statusTranslations[locale as keyof typeof statusTranslations]?.[newStatus as keyof typeof statusTranslations.uk] || newStatus;

    // Відправка оновлення статусу клієнту
    await sendEmail({
      from: 'orders@yourdomain.com',
      to: [orderDetails.customerEmail],
      subject: t.subject,
      html: `
        <h2>${t.title}</h2>
        <p>${t.status} <strong>${statusText}</strong></p>
        <p>${t.thanks}</p>
        <p>${t.questions}</p>
      `,
    });

    console.log(`Лист оновлення статусу замовлення успішно відправлено до ${orderDetails.customerEmail}`);
  } catch (error) {
    console.error('Помилка відправки листа оновлення статусу:', error);
    throw error;
  }
};

/**
 * Відправляє листи з повідомленням про поставку
 * @param orderDetails Деталі замовлення
 * @param trackingNumber Номер відстеження
 * @param shippingCarrier Перевізник
 */
export const sendShipmentNotification = async (
  orderDetails: any,
  trackingNumber: string,
  shippingCarrier: string
): Promise<void> => {
  try {
    const locale = orderDetails.locale || 'uk';
    
    const translations = {
      uk: {
        subject: `Ваше замовлення #${orderDetails.orderId} відправлено`,
        title: 'Ваше замовлення відправлено!',
        shipped: 'Ми раді повідомити, що ваше замовлення було відправлено.',
        tracking: 'Номер для відстеження:',
        carrier: 'Перевізник:',
        trackLink: 'Відстежити відправлення',
        eta: 'Очікуваний час доставки:',
        thanks: 'Дякуємо за вибір нашої компанії!',
        support: 'Якщо у вас є запитання, будь ласка, зв\'яжіться з нашою службою підтримки.'
      },
      en: {
        subject: `Your Order #${orderDetails.orderId} Has Shipped`,
        title: 'Your Order Has Shipped!',
        shipped: 'We're pleased to let you know that your order has been shipped.',
        tracking: 'Tracking Number:',
        carrier: 'Carrier:',
        trackLink: 'Track Your Shipment',
        eta: 'Estimated Delivery:',
        thanks: 'Thank you for choosing our company!',
        support: 'If you have any questions, please contact our customer support.'
      }
    };
    
    const t = translations[locale as keyof typeof translations] || translations.en;
    
    // Створення трекінгового посилання в залежності від перевізника
    let trackingUrl = '#';
    switch(shippingCarrier.toLowerCase()) {
      case 'ups':
        trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
        break;
      case 'fedex':
        trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
        break;
      case 'usps':
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
        break;
      case 'dhl':
        trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
        break;
      case 'canada post':
      case 'canada':
        trackingUrl = `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${trackingNumber}`;
        break;
      default:
        trackingUrl = '#';
    }

    // Відправка сповіщення про відправлення клієнту
    await sendEmail({
      from: 'shipping@yourdomain.com',
      to: [orderDetails.customerEmail],
      subject: t.subject,
      html: `
        <h2>${t.title}</h2>
        <p>${t.shipped}</p>
        <p><strong>${t.tracking}</strong> ${trackingNumber}</p>
        <p><strong>${t.carrier}</strong> ${shippingCarrier}</p>
        <p><a href="${trackingUrl}" target="_blank">${t.trackLink}</a></p>
        ${orderDetails.estimatedDelivery ? `<p><strong>${t.eta}</strong> ${orderDetails.estimatedDelivery}</p>` : ''}
        <p>${t.thanks}</p>
        <p>${t.support}</p>
      `,
    });

    console.log(`Лист з повідомленням про відправлення успішно надіслано до ${orderDetails.customerEmail}`);
  } catch (error) {
    console.error('Помилка відправки листа про відправлення:', error);
    throw error;
  }
};
