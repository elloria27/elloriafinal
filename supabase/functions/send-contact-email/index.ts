
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Ініціалізація Resend для відправки електронних листів
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Ініціалізація Supabase для збереження звернень
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS заголовки для доступу з веб-інтерфейсу
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Інтерфейс для даних контактної форми
interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

// Основний обробник запитів
const handler = async (req: Request): Promise<Response> => {
  // Обробка CORS preflight запитів
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Отримано запит контактної форми");
    const formData: ContactFormData = await req.json();
    console.log("Дані форми:", formData);

    // Список email-адрес для отримання повідомлень
    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Збереження дані форми в базі даних для подальшого моніторингу
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            newsletter_opt_in: formData.newsletter,
            status: 'new'
          }
        ]);

      if (error) {
        console.error("Помилка збереження форми:", error);
      } else {
        console.log("Запис контактної форми збережено успішно");
      }
    } catch (dbError) {
      console.error("Помилка бази даних:", dbError);
      // Продовжуємо виконання, щоб принаймні відправити електронний лист
    }

    // Відправка сповіщення команді
    const emailResponse = await resend.emails.send({
      from: "Elloria Contact Form <contact@elloria.ca>",
      to: recipients,
      subject: `Нове повідомлення через форму: ${formData.subject}`,
      html: `
        <h1>Нове повідомлення через форму зв'язку</h1>
        <h2>Контактна інформація</h2>
        <p><strong>Ім'я:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Телефон:</strong> ${formData.phone || "Не вказано"}</p>
        <p><strong>Тема:</strong> ${formData.subject}</p>
        <h2>Повідомлення</h2>
        <p>${formData.message}</p>
        <p><strong>Підписка на розсилку:</strong> ${formData.newsletter ? "Так" : "Ні"}</p>
      `,
    });

    // Відправка підтвердження користувачу
    const confirmationResponse = await resend.emails.send({
      from: "Elloria <contact@elloria.ca>",
      to: [formData.email],
      subject: "Дякуємо за ваше повідомлення",
      html: `
        <h1>Дякуємо за ваше повідомлення!</h1>
        <p>Шановний(а) ${formData.fullName},</p>
        <p>Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.</p>
        <p>З повагою,<br>Команда Elloria</p>
      `,
    });

    console.log("Електронні листи відправлено успішно");

    return new Response(JSON.stringify({ email: emailResponse, confirmation: confirmationResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Помилка відправлення контактного email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
