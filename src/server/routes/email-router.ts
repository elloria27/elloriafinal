
import express from 'express';
import { Request, Response } from 'express';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

// Send contact email (replaces send-contact-email edge function)
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, subject, message, newsletter } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Send email to team
    await sendEmail({
      from: "Elloria Contact Form <contact@elloria.ca>",
      to: recipients,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h2>Message</h2>
        <p>${message}</p>
        <p><strong>Newsletter Subscription:</strong> ${newsletter ? "Yes" : "No"}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({ error: "Failed to send contact email" });
  }
});

// Send subscription email (replaces send-subscription-email edge function)
router.post('/subscription', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Send email to customer
    await sendEmail({
      from: "Elloria <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Elloria's Exclusive Offers!",
      html: `
        <h1>Thank You for Subscribing!</h1>
        <p>Welcome to Elloria's exclusive offers program! You'll be the first to know about our best deals and new products.</p>
        <p>Use code <strong>THANKYOU10</strong> for 10% off your next purchase!</p>
        <p>Best regards,<br>The Elloria Team</p>
      `,
    });

    // Send notification to admin team
    await sendEmail({
      from: "Elloria Notifications <onboarding@resend.dev>",
      to: ["sales@elloria.ca", "mariia_r@elloria.ca", "bogdana_v@elloria.ca"],
      subject: "New Subscription from Thanks Page",
      html: `
        <h1>New Subscription</h1>
        <p>A new user has subscribed to exclusive offers:</p>
        <p>Email: ${email}</p>
        <p>Source: Thanks Page</p>
      `,
    });

    return res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error processing subscription:", error);
    return res.status(500).json({ error: "Failed to process subscription" });
  }
});

// Send order status email (replaces send-order-status-email edge function)
router.post('/order-status', async (req: Request, res: Response) => {
  try {
    const { customerEmail, customerName, orderId, orderNumber, newStatus } = req.body;

    if (!customerEmail || !customerName || !orderId || !orderNumber || !newStatus) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const companyInfo = {
      name: 'Elloria Eco Products LTD.',
      address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
      phone: '(204) 930-2019',
      email: 'sales@elloria.ca',
      gst: '742031420RT0001',
      logo: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/logo.png'
    };

    // Create email HTML content with improved styling
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${companyInfo.logo}" alt="${companyInfo.name}" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Order Status Update</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 10px;">Dear ${customerName},</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            Your order #${orderNumber} has been updated to: 
            <strong style="color: #0094F4">${newStatus}</strong>
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px;">Company Information</h2>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">
            ${companyInfo.name}<br>
            ${companyInfo.address}<br>
            Phone: ${companyInfo.phone}<br>
            Email: ${companyInfo.email}<br>
            GST Number: ${companyInfo.gst}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">
            If you have any questions about your order, please don't hesitate to contact our customer support at 
            <a href="mailto:${companyInfo.email}" style="color: #0094F4; text-decoration: none;">${companyInfo.email}</a>
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Thank you for choosing ${companyInfo.name}!
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      from: `${companyInfo.name} <orders@elloria.ca>`,
      to: [customerEmail],
      subject: `Order Status Update - #${orderNumber}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in send-order-status-email:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
