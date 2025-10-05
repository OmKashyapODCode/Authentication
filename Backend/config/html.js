export const getOtpHtml = ({ email, otp }) => {
  const appName = process.env.APP_NAME || "Authentication App";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${appName} - Email Verification</title>
<style>
  /* Base reset */
  html, body { margin: 0; padding: 0; }
  body {
    background: #f4f6fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #111827;
    -webkit-text-size-adjust: 100%;
  }
  table { border-collapse: collapse; width: 100%; }
  img { border: 0; display: block; }

  /* Layout */
  .wrapper { width: 100%; padding: 24px; background: #f4f6fa; }
  .container {
    max-width: 600px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin: 0 auto;
  }
  .header {
    background: #111827;
    padding: 24px;
    text-align: center;
  }
  .brand {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
  }

  /* Content */
  .content { padding: 32px; text-align: left; }
  .title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 16px;
  }
  .text {
    font-size: 15px;
    color: #374151;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  .otp {
    display: inline-block;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 10px;
    color: #111827;
    margin: 20px 0;
  }
  .muted {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  /* Footer */
  .footer {
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    padding: 16px;
  }

  @media (max-width: 600px) {
    .content { padding: 24px !important; }
    .otp { font-size: 26px; letter-spacing: 6px; }
  }
</style>
</head>
<body>
  <div class="wrapper">
    <table class="container" role="presentation">
      <tr><td class="header"><span class="brand">${appName}</span></td></tr>
      <tr><td class="content">
        <h1 class="title">Verify your email - ${email}</h1>
        <p class="text">Use the verification code below to complete your sign-in to <strong>${appName}</strong>.</p>
        <div style="text-align:center;">
          <div class="otp">${otp}</div>
        </div>
        <p class="muted">This code will expire in <strong>5 minutes</strong>.</p>
        <p class="muted">If you didn’t request this, you can safely ignore this email.</p>
      </td></tr>
      <tr><td class="footer">© ${new Date().getFullYear()} ${appName}. All rights reserved.</td></tr>
    </table>
  </div>
</body>
</html>`;
  return html;
};


export const getVerifyEmailHtml = ({ email, token }) => {
  const appName = process.env.APP_NAME || "Authentication App";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${appName} - Verify Your Account</title>
<style>
  html, body { margin: 0; padding: 0; }
  body {
    background: #f4f6fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #111827;
  }
  table { border-collapse: collapse; width: 100%; }

  .wrapper { width: 100%; padding: 24px; background: #f4f6fa; }
  .container {
    max-width: 600px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin: 0 auto;
  }
  .header {
    background: #111827;
    text-align: center;
    padding: 24px;
  }
  .brand {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
  }
  .content {
    padding: 32px;
  }
  .title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 16px;
  }
  .text {
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .btn {
    display: inline-block;
    background: #111827;
    color: #fff !important;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    margin: 20px 0;
  }
  .muted {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .link {
    color: #2563eb;
    text-decoration: underline;
    word-break: break-all;
  }
  .footer {
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    padding: 16px;
  }
  @media (max-width: 600px) {
    .content { padding: 24px !important; }
  }
</style>
</head>
<body>
  <div class="wrapper">
    <table class="container" role="presentation">
      <tr><td class="header"><span class="brand">${appName}</span></td></tr>
      <tr><td class="content">
        <h1 class="title">Verify your account - ${email}</h1>
        <p class="text">Thanks for registering with ${appName}. Click the button below to verify your account.</p>
        <div style="text-align:center;">
          <a class="btn" href="${verifyUrl}" target="_blank" rel="noopener">Verify Account</a>
        </div>
        <p class="muted">If the button doesn’t work, copy and paste this link into your browser:</p>
        <p class="muted"><a class="link" href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a></p>
        <p class="muted">If you didn’t sign up, you can safely ignore this email.</p>
      </td></tr>
      <tr><td class="footer">© ${new Date().getFullYear()} ${appName}. All rights reserved.</td></tr>
    </table>
  </div>
</body>
</html>`;
  return html;
};
