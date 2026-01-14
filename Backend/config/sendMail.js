import { Resend } from "resend";

const resend = new Resend("re_ZeAgo8Hy_AKXp2m2N2mwYpuZgpTQf5Yzm");

const sendMail = async ({ email, subject, html }) => {
  console.log("Before sendMail");

  const { data, error } = await resend.emails.send({
    from: "Website <website@resend.dev>",
    to: email,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Email not sent");
  }

  console.log("After sendMail", data);
};

export default sendMail;
