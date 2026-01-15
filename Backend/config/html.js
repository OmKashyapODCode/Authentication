export const getOtpHtml = ({ email, otp }) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Verification Code</title>
    <style>
      /* --- Reset --- */
      html, body { margin: 0; padding: 0; width: 100%; background-color: #f4f7ff; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
      
      /* --- Layout --- */
      .wrapper { width: 100%; background-color: #f4f7ff; padding: 40px 0; }
      .container {
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        background-color: #ffffff;
        border-radius: 16px; /* Softer corners */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* Soft shadow */
        overflow: hidden;
      }
      
      /* --- Typography --- */
      .brand {
        display: block;
        padding: 30px 40px 10px;
        font-size: 22px;
        font-weight: 700;
        color: #007bff; /* Primary Blue */
        text-align: center;
        text-decoration: none;
      }
      .title {
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
        text-align: center;
      }
      .text {
        font-size: 16px;
        color: #555555;
        text-align: center;
        margin: 0 0 20px 0;
        padding: 0 40px;
      }
      
      /* --- OTP Box --- */
      .otp-container { padding: 10px 40px 30px; text-align: center; }
      .otp-box {
        display: inline-block;
        background-color: #eef4ff; /* Very light blue bg */
        color: #0069d9; /* Darker blue text */
        font-family: monospace;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 6px;
        padding: 20px 40px;
        border-radius: 12px;
        border: 1px solid #cce5ff;
      }
      
      /* --- Footer --- */
      .footer {
        padding: 20px;
        text-align: center;
        background-color: #ffffff;
        border-top: 1px solid #f0f0f0;
      }
      .muted { font-size: 13px; color: #999999; margin: 0; }
      
      /* --- Mobile --- */
      @media only screen and (max-width: 600px) {
        .wrapper { padding: 15px; }
        .text { padding: 0 20px; }
        .otp-box { font-size: 26px; padding: 15px 20px; letter-spacing: 4px; width: 100%; box-sizing: border-box; }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="wrapper" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" class="container" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <span class="brand">Authentication App</span>
              </td>
            </tr>
            
            <tr>
              <td>
                <h1 class="title">Verification Code</h1>
                <p class="text">Please use the code below to complete your authentication. This code expires in 5 minutes.</p>
                
                <div class="otp-container">
                  <span class="otp-box">${otp}</span>
                </div>
              </td>
            </tr>
            
            <tr>
              <td class="footer">
                <p class="muted">If you didn't request this, you can ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return html;
};
export const getVerifyEmailHtml = ({ email, token }) => {
  const appName = "Authentication App";
  const baseUrl = "https://authentication-odcode.onrender.com";
  const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Verify Your Account</title>
    <style>
      /* --- Reset --- */
      html, body { margin: 0; padding: 0; width: 100%; background-color: #f4f7ff; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
      
      /* --- Layout --- */
      .wrapper { width: 100%; background-color: #f4f7ff; padding: 40px 0; }
      .container {
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      
      /* --- Typography --- */
      .brand {
        display: block;
        padding: 30px 40px 10px;
        font-size: 22px;
        font-weight: 700;
        color: #007bff;
        text-align: center;
        text-decoration: none;
      }
      .title {
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
        text-align: center;
      }
      .text {
        font-size: 16px;
        color: #555555;
        text-align: center;
        margin: 0 0 30px 0;
        padding: 0 40px;
      }
      
      /* --- The New Button (Pill Shape) --- */
      .btn-container { text-align: center; margin-bottom: 40px; }
      .btn {
        display: inline-block;
        background-color: #007bff; /* Bright Blue */
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        padding: 16px 40px;
        border-radius: 50px; /* Full rounded pill shape */
        box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3); /* Blue shadow glow */
        transition: background-color 0.3s ease;
      }
      .btn:hover { background-color: #0056b3; }
      
      /* --- Link Fallback --- */
      .fallback-container { 
        background-color: #f8f9fa; 
        padding: 20px 40px; 
        border-top: 1px solid #eeeeee;
        text-align: center;
      }
      .link-text { font-size: 13px; color: #999999; margin-bottom: 8px; }
      .link-url { font-size: 13px; color: #007bff; text-decoration: none; word-break: break-all; }
      
      /* --- Mobile --- */
      @media only screen and (max-width: 600px) {
        .wrapper { padding: 15px; }
        .text { padding: 0 20px; }
        .btn { width: 80%; display: block; margin: 0 auto; box-sizing: border-box; }
        .fallback-container { padding: 20px; }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="wrapper" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" class="container" border="0" cellspacing="0" cellpadding="0">
            
            <tr>
              <td>
                <a href="${baseUrl}" class="brand">${appName}</a>
              </td>
            </tr>
            
            <tr>
              <td>
                <h1 class="title">Verify your email</h1>
                <p class="text">
                  Welcome! You're almost there. Please click the button below to verify your email address for <strong>${email}</strong>.
                </p>
                
                <div class="btn-container">
                  <a href="${verifyUrl}" class="btn">Verify Email Address</a>
                </div>
              </td>
            </tr>
            
            <tr>
              <td class="fallback-container">
                <p class="link-text">Button not working? Copy and paste this link:</p>
                <a href="${verifyUrl}" class="link-url">${verifyUrl}</a>
                <p class="link-text" style="margin-top: 20px;">
                  © ${new Date().getFullYear()} ${appName}. All rights reserved.
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return html;
};
