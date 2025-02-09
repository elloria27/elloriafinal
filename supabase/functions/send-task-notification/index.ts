
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
    console.log("Starting task notification process");

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error("Authentication error:", authError);
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

    console.log("Received task notification request:", {
      taskId,
      assignedTo,
      taskTitle,
      priority,
      category
    });

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

    console.log("Found admin email:", adminProfile.email);

    // Create notification record
    const { error: notificationError } = await supabase
      .from('hrm_task_notifications')
      .insert({
        task_id: taskId,
        user_id: assignedTo,
        notification_type: 'assigned',
        message: `You have been assigned a new task: ${taskTitle}`,
        email_sent: false
      });

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
      throw new Error("Failed to create notification");
    }

    console.log("Created notification record");

    // Send email
    console.log("Attempting to send email via Resend");
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

    // Update notification record to mark email as sent
    if (emailResponse) {
      console.log("Email sent successfully:", emailResponse);
      
      const { error: updateError } = await supabase
        .from('hrm_task_notifications')
        .update({ email_sent: true })
        .eq('task_id', taskId)
        .eq('user_id', assignedTo)
        .eq('notification_type', 'assigned');

      if (updateError) {
        console.error("Error updating notification:", updateError);
      }
    }

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
