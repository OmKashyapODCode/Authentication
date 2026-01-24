import { Resend } from "resend";

const sendMail = async ({ email, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "no-reply@resend.dev",
    to:  email,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw error;
  }
};

export default sendMail;
