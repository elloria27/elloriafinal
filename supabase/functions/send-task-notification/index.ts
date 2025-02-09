
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TaskNotificationRequest {
  taskId: string;
  assignedTo: string;
  taskTitle: string;
  taskDescription: string;
  dueDate?: string;
  priority: string;
  category: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const {
      taskId,
      assignedTo,
      taskTitle,
      taskDescription,
      dueDate,
      priority,
      category,
    }: TaskNotificationRequest = await req.json();

    // Get the assigned admin's email from their profile
    const { data: adminProfile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", assignedTo)
      .single();

    if (profileError || !adminProfile?.email) {
      console.error("Error fetching admin profile:", profileError);
      throw new Error("Could not find admin email");
    }

    const emailResponse = await resend.emails.send({
      from: "Task Manager <onboarding@resend.dev>",
      to: [adminProfile.email],
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <h1>New Task Assigned</h1>
        <p>You have been assigned a new task in the task management system.</p>
        
        <h2>Task Details:</h2>
        <ul>
          <li><strong>Title:</strong> ${taskTitle}</li>
          <li><strong>Description:</strong> ${taskDescription}</li>
          ${dueDate ? `<li><strong>Due Date:</strong> ${dueDate}</li>` : ""}
          <li><strong>Priority:</strong> ${priority}</li>
          <li><strong>Category:</strong> ${category}</li>
        </ul>

        <p>Please log in to the system to view the complete task details and start working on it.</p>
      `,
    });

    console.log("Task notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending task notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
