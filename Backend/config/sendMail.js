import { createTransport } from "nodemailer";

const sendMail = async ({ email, subject, html }) => {

  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
console.log("start 1")
  console.log("Before sendMail");

await transport.sendMail({
  from: `"Auth App" <${process.env.SMTP_USER}>`,
  to: email,
  subject,
  html,
});

console.log("After sendMail");

};
console.log("start : 2")
export default sendMail;
