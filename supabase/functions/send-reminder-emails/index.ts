
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";
import { toZonedTime, formatInTimeZone } from 'npm:date-fns-tz@3.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const timeZone = 'America/Winnipeg';

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (_req: Request): Promise<Response> => {
  try {
    console.log("Starting reminder email check...");

    // Get current date and time in Winnipeg timezone
    const now = new Date();
    const winnipegTime = toZonedTime(now, timeZone);
    const currentDate = formatInTimeZone(winnipegTime, timeZone, 'yyyy-MM-dd');
    const currentTime = formatInTimeZone(winnipegTime, timeZone, 'HH:mm');

    console.log(`Checking for reminders at date: ${currentDate} and time: ${currentTime} (${timeZone})`);

    // Fetch reminders due now with profiles
    const { data: reminders, error: reminderError } = await supabase
      .from('hrm_personal_reminders')
      .select(`
        *,
        admin:admin_id (
          email,
          full_name
        )
      `)
      .eq('reminder_date', currentDate)
      .eq('reminder_time', currentTime)
      .eq('status', true)
      .eq('email_notify', true);

    if (reminderError) throw reminderError;

    console.log(`Found ${reminders?.length || 0} reminders for current time:`, reminders);

    // Send emails for each reminder
    const emailPromises = reminders?.map(async (reminder) => {
      const adminEmail = reminder.admin?.email;
      const adminName = reminder.admin?.full_name || 'Admin';

      if (!adminEmail) {
        console.log(`No email found for reminder ${reminder.id}`);
        return;
      }

      try {
        console.log(`Sending reminder email to ${adminEmail} for reminder: ${reminder.title}`);
        
        const emailResponse = await resend.emails.send({
          from: "Elloria HRM <notifications@elloria.ca>",
          to: [adminEmail],
          subject: `Reminder: ${reminder.title}`,
          html: `
            <h1>Reminder Alert - ${reminder.title}</h1>
            <p>Hello ${adminName},</p>
            <p>This is a reminder for your scheduled task:</p>
            <ul>
              <li><strong>Title:</strong> ${reminder.title}</li>
              <li><strong>Date:</strong> ${reminder.reminder_date}</li>
              <li><strong>Time:</strong> ${formatInTimeZone(
                new Date(`2000-01-01T${reminder.reminder_time}`),
                timeZone,
                'h:mm a'
              )}</li>
              ${reminder.description ? `<li><strong>Details:</strong> ${reminder.description}</li>` : ''}
            </ul>
            <p>Best Regards,<br>Your HRM System</p>
          `,
        });

        console.log(`Email sent successfully for reminder ${reminder.id}:`, emailResponse);
        return emailResponse;
      } catch (error) {
        console.error(`Error sending email for reminder ${reminder.id}:`, error);
        throw error;
      }
    });

    if (emailPromises?.length) {
      await Promise.all(emailPromises);
    }

    return new Response(
      JSON.stringify({ message: "Reminder emails processed successfully" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing reminder emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
};

serve(handler);
