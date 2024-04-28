import "dotenv/config";
import { Resend } from 'resend';
import { Router } from 'express';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/api/mails', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: `<strong>${message}</strong>`
    });

    console.log('Email sent:', data);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;
