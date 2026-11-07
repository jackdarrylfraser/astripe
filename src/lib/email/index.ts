import { resend } from "./client";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, from = "onboarding@resend.dev", replyTo, cc, bcc } = options;

  try {
    const response = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      ...(replyTo && { replyTo }),
      ...(cc && { cc: Array.isArray(cc) ? cc : [cc] }),
      ...(bcc && { bcc: Array.isArray(bcc) ? bcc : [bcc] }),
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string) {
  return sendEmail({
    to: email,
    subject: "Welcome!",
    html: `
      <h1>Welcome!</h1>
      <p>Thanks for joining us. We're excited to have you on board.</p>
    `,
    text: "Welcome! Thanks for joining us.",
  });
}
