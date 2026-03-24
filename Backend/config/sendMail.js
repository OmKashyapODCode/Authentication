// //  =======================* for Development *==========================

// import { createTransport } from "nodemailer";

// const sendMail = async ({ email, subject, html }) => {
//   const transport = createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   await transport.sendMail({
//     from: process.env.SMTP_USER,
//     to: email,
//     subject,
//     html,
//   });
// };

// export default sendMail;


// =======================* for Production *==========================

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
