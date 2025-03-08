
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationData {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  message: string;
  termsAccepted: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Обробка CORS preflight запитів
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Отримано реєстрацію в програмі сталого розвитку");
    const data: RegistrationData = await req.json();
    console.log("Дані реєстрації:", data);

    // Збереження в business_form_submissions
    console.log("Збереження даних у базі даних...");
    const { data: submissionData, error: submissionError } = await supabase
      .from('business_form_submissions')
      .insert([
        {
          full_name: data.fullName,
          company_name: data.companyName,
          email: data.email,
          phone: data.phone,
          message: data.message,
          form_type: 'sustainability',
          status: 'new',
          terms_accepted: data.termsAccepted
        }
      ])
      .select()
      .single();

    if (submissionError) {
      console.error("Помилка збереження заявки:", submissionError);
      throw submissionError;
    }

    console.log("Заявка успішно збережена:", submissionData);

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Відправка сповіщення команді Elloria
    const teamEmailResponse = await resend.emails.send({
      from: "Elloria Sustainability Program <sustainability@elloria.ca>",
      to: recipients,
      subject: "Нова реєстрація в програмі сталого розвитку",
      html: `
        <h1>Нова реєстрація в програмі сталого розвитку</h1>
        <h2>Контактна інформація</h2>
        <p><strong>Ім'я:</strong> ${data.fullName}</p>
        <p><strong>Компанія:</strong> ${data.companyName || "Не вказано"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Телефон:</strong> ${data.phone || "Не вказано"}</p>
        <h2>Повідомлення</h2>
        <p>${data.message}</p>
      `,
    });

    // Відправка підтвердження користувачу
    const userEmailResponse = await resend.emails.send({
      from: "Elloria Sustainability Program <sustainability@elloria.ca>",
      to: [data.email],
      subject: "Дякуємо за інтерес до нашої програми сталого розвитку",
      html: `
        <h1>Дякуємо за ваш інтерес!</h1>
        <p>Шановний(а) ${data.fullName},</p>
        <p>Дякуємо за інтерес до програми сталого розвитку Elloria. Ми отримали вашу реєстрацію і незабаром її розглянемо.</p>
        <p>Ми зв'яжемося з вами найближчим часом, щоб обговорити наступні кроки та як ми можемо спільно працювати над створенням більш стійкого майбутнього.</p>
        <p>З повагою,<br>Команда сталого розвитку Elloria</p>
      `,
    });

    console.log("Електронні листи успішно відправлено:", { teamEmailResponse, userEmailResponse });

    return new Response(JSON.stringify({ teamEmailResponse, userEmailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Помилка обробки реєстрації:", error);
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
