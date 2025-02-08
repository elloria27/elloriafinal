
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task } = await req.json();

    // Get assignee's email
    const { data: assignee, error: assigneeError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", task.assigned_to)
      .single();

    if (assigneeError) throw assigneeError;

    // Get creator's email
    const { data: creator, error: creatorError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", task.created_by)
      .single();

    if (creatorError) throw creatorError;

    // Send email to assignee
    const emailResponse = await resend.emails.send({
      from: "HRM System <notifications@elloria.ca>",
      to: [assignee.email],
      subject: `New Task Assigned: ${task.title}`,
      html: `
        <h1>New Task Assignment</h1>
        <p>Hello ${assignee.full_name},</p>
        <p>A new task has been assigned to you:</p>
        <ul>
          <li><strong>Title:</strong> ${task.title}</li>
          <li><strong>Description:</strong> ${task.description || 'No description provided'}</li>
          <li><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleString()}</li>
          <li><strong>Priority:</strong> ${task.priority}</li>
          <li><strong>Assigned By:</strong> ${creator.full_name}</li>
        </ul>
        <p>Please log in to the HRM system to view more details and manage this task.</p>
        <p>Best regards,<br>Your HRM System</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending task notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
