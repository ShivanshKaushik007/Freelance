import { Resend } from "resend";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    throw new Error("Resend env vars missing");
  }

  const resend = new Resend(apiKey);
  return resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
