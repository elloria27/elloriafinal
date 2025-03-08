
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Інформація про компанію для шаблону листа
const companyInfo = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  gst: '742031420RT0001',
  logo: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/logo.png'
};

// Інтерфейс для даних оновлення статусу замовлення
interface OrderStatusEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  newStatus: string;
  orderItems?: any[];
  orderTotal?: number;
  currency?: string;
}

// Функція для отримання локалізованого назви статусу
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'В обробці',
    'processing': 'Обробляється',
    'shipped': 'Відправлено',
    'delivered': 'Доставлено',
    'cancelled': 'Скасовано',
    'refunded': 'Повернуто',
    'paid': 'Оплачено'
  };
  
  return statusMap[status] || status;
};

// Функція для створення статусної кольорової позначки
const getStatusColor = (status: string): string => {
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
};

const handler = async (req: Request): Promise<Response> => {
  // Обробка CORS preflight запитів
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Отримано запит на відправку оновлення статусу замовлення');
    const details: OrderStatusEmailDetails = await req.json();
    console.log('Деталі оновлення статусу замовлення:', details);

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY не встановлено');
    }

    const resend = new Resend(RESEND_API_KEY);

    // Локалізована назва статусу
    const statusText = getStatusText(details.newStatus);
    const statusColor = getStatusColor(details.newStatus);

    // Створення HTML контенту листа з покращеним стилем
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${companyInfo.logo}" alt="${companyInfo.name}" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Оновлення Статусу Замовлення</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 10px;">Шановний(а) ${details.customerName},</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            Статус вашого замовлення №${details.orderNumber} змінено на: 
            <span style="display: inline-block; background-color: ${statusColor}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">${statusText}</span>
          </p>

          ${details.orderItems ? `
          <div style="margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">Ваше Замовлення</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f1f1;">
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Товар</th>
                  <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Кількість</th>
                  <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Ціна</th>
                </tr>
              </thead>
              <tbody>
                ${details.orderItems.map(item => `
                  <tr>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${item.price} ${details.currency || 'CAD'}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Загальна сума:</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold;">${details.orderTotal} ${details.currency || 'CAD'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px;">Інформація про компанію</h2>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">
            ${companyInfo.name}<br>
            ${companyInfo.address}<br>
            Телефон: ${companyInfo.phone}<br>
            Email: ${companyInfo.email}<br>
            GST номер: ${companyInfo.gst}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">
            Якщо у вас є запитання щодо замовлення, будь ласка, зв'яжіться з нашою службою підтримки за адресою 
            <a href="mailto:${companyInfo.email}" style="color: #0094F4; text-decoration: none;">${companyInfo.email}</a>
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Дякуємо за вибір ${companyInfo.name}!
          </p>
        </div>
      </div>
    `;

    console.log('Відправлення електронного листа через Resend');
    const emailResponse = await resend.emails.send({
      from: `${companyInfo.name} <orders@elloria.ca>`,
      to: [details.customerEmail],
      subject: `Оновлення статусу замовлення - №${details.orderNumber}`,
      html: emailHtml,
    });

    console.log('Електронний лист успішно відправлено:', emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Помилка у функції send-order-status-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
