import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const deliver = async (to: string, subject: string, html: string, devLog: string) => {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.log(devLog);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const sendResetCode = (to: string, name: string, code: string) =>
  deliver(
    to,
    "Your Home Interior password reset code",
    `
      <p>Hi ${escapeHtml(name)},</p>
      <p>Your password reset code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;">${code}</p>
      <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
    `,
    `Reset code for ${to}: ${code}`
  );

export const sendAccountDecision = (to: string, name: string, approved: boolean) =>
  deliver(
    to,
    approved ? "Your Home Interior account has been approved" : "Update on your Home Interior registration",
    approved
      ? `<p>Hi ${escapeHtml(name)},</p><p>Your account has been approved. You can now sign in.</p>`
      : `<p>Hi ${escapeHtml(name)},</p><p>Your registration was not approved. Please contact an administrator if you think this is a mistake.</p>`,
    `Account ${approved ? "approved" : "rejected"} email for ${to}`
  );