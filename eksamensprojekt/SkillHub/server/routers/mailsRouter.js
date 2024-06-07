import "dotenv/config";
import { Resend } from "resend";
import { Router } from "express";
import { sanitizeHTML, sanitizeEmail } from "../util/sanitize.js";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/mails", async (req, res) => {
  if (req.session.user) {
    try {
      let { to, subject, message } = req.body;

      to = sanitizeEmail("chri46nj@stud.kea.dk");
      subject = sanitizeHTML(subject);
      message = sanitizeHTML(message);

      if (!to || !subject || !message) {
        return res.status(400).json({
          error: "Please make sure Email, Subject and Message is filled out",
        });
      }

      const data = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: sanitizeEmail("chri46nj@stud.kea.dk"),
        subject: sanitizeHTML(subject),
        html: sanitizeHTML(message),
      });

      res.status(200).send({ message: "Email sent successfully" });
    } catch (error) {
      res.status(500).send({ error: "Failed to send email" });
    }
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
});

export default router;
