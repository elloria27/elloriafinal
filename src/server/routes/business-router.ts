
import express from 'express';
import { Request, Response } from 'express';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

// Business inquiry (replaces send-business-inquiry edge function)
router.post('/inquiry', async (req: Request, res: Response) => {
  try {
    const { fullName, companyName, email, phoneNumber, businessType, message, attachments } = req.body;

    if (!fullName || !companyName || !email || !businessType || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store the submission in the database (mock for now)
    console.log("Storing business submission:", { 
      fullName, 
      companyName, 
      email, 
      phoneNumber, 
      businessType, 
      message,
      attachments: attachments?.length
    });

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Map attachments to include the original file extension
    const formattedAttachments = attachments?.map(attachment => ({
      filename: attachment.name,
      content: attachment.content,
    }));

    await sendEmail({
      from: "Elloria Business <business@elloria.ca>",
      to: recipients,
      subject: "New Business Inquiry",
      html: `
        <h1>New Business Inquiry</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber || "Not provided"}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <h2>Message</h2>
        <p>${message}</p>
      `,
      attachments: formattedAttachments,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in business inquiry handler:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Sustainability program registration (replaces send-sustainability-registration edge function)
router.post('/sustainability-registration', async (req: Request, res: Response) => {
  try {
    const { fullName, companyName, email, phone, message, termsAccepted } = req.body;

    if (!fullName || !email || !message || !termsAccepted) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("Storing sustainability submission:", { 
      fullName, 
      companyName, 
      email, 
      phone, 
      message,
      termsAccepted
    });

    const recipients = [
      "sales@elloria.ca",
      "mariia_r@elloria.ca",
      "bogdana_v@elloria.ca"
    ];

    // Send notification to Elloria team
    await sendEmail({
      from: "Elloria Sustainability Program <sustainability@elloria.ca>",
      to: recipients,
      subject: "New Sustainability Program Registration",
      html: `
        <h1>New Sustainability Program Registration</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Company:</strong> ${companyName || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <h2>Message</h2>
        <p>${message}</p>
      `,
    });

    // Send confirmation to user
    await sendEmail({
      from: "Elloria Sustainability Program <sustainability@elloria.ca>",
      to: [email],
      subject: "Thank You for Your Interest in Our Sustainability Program",
      html: `
        <h1>Thank You for Your Interest!</h1>
        <p>Dear ${fullName},</p>
        <p>Thank you for your interest in joining the Elloria Sustainability Program. We have received your registration and our team will review it shortly.</p>
        <p>We will contact you soon to discuss the next steps and how we can work together towards a more sustainable future.</p>
        <p>Best regards,<br>The Elloria Sustainability Team</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing registration:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
