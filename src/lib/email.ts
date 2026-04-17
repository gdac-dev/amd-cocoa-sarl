import nodemailer from 'nodemailer';

/**
 * Auto-detects the correct SMTP config from the sender's email domain.
 * The RECIPIENT can be ANY email provider (Yahoo, Outlook, Gmail, etc.)
 * Only the SENDER email domain matters for SMTP host selection.
 */
function getSMTPConfig(senderEmail: string) {
  const domain = senderEmail.split('@')[1]?.toLowerCase() || '';

  // Google Workspace (e.g. @strivingforall.org using Google) or Gmail
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return { host: 'smtp.gmail.com', port: 587, secure: false };
  }

  // Google Workspace custom domain — uses same Gmail SMTP
  // Covers @strivingforall.org and any org using Google Workspace
  if (process.env.SMTP_PROVIDER === 'google' || domain.includes('strivingforall')) {
    return { host: 'smtp.gmail.com', port: 587, secure: false };
  }

  // Microsoft / Outlook / Hotmail / Live
  if (['outlook.com', 'hotmail.com', 'live.com', 'msn.com'].includes(domain)) {
    return { host: 'smtp-mail.outlook.com', port: 587, secure: false };
  }

  // Yahoo Mail
  if (['yahoo.com', 'yahoo.fr', 'yahoo.co.uk', 'ymail.com'].includes(domain)) {
    return { host: 'smtp.mail.yahoo.com', port: 587, secure: false };
  }

  // iCloud Mail
  if (['icloud.com', 'me.com', 'mac.com'].includes(domain)) {
    return { host: 'smtp.mail.me.com', port: 587, secure: false };
  }

  // ProtonMail Bridge (local bridge must be running)
  if (['proton.me', 'protonmail.com', 'pm.me'].includes(domain)) {
    return { host: '127.0.0.1', port: 1025, secure: false };
  }

  // Generic fallback — use env-provided host or Gmail
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
  };
}

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass || pass.trim() === '' || pass === 'your-app-password') {
    return null; // Will fall back to terminal logging
  }

  const smtpConfig = getSMTPConfig(user);

  return nodemailer.createTransport({
    ...smtpConfig,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function send2FACode(toEmail: string, code: string) {
  // ALWAYS log to terminal for visibility (useful during dev)
  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  [AMD EMAIL] To: ${toEmail}`);
  console.log(`║  [AMD EMAIL] Code: ${code}`);
  console.log('╚══════════════════════════════════════╝\n');

  const transporter = createTransporter();

  if (!transporter) {
    console.warn('[EMAIL] ⚠️  SMTP_PASSWORD not set in .env — email not sent. Code logged above.');
    return true; // Don't block the UX in development
  }

  const senderName = 'AMD Cocoa Sarl';
  const senderEmail = process.env.SMTP_USER!;

  try {
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: toEmail,
      subject: '🍫 AMD Cocoa – Your Verification Code',
      text: `Your verification code is: ${code}\n\nIt expires in 15 minutes. Do not share this code.`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5ede0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede0;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#fdfaf6;border-radius:14px;overflow:hidden;border:1px solid #e8d9c8;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
        
        <tr>
          <td style="background:#3b1f0a;padding:28px 32px;text-align:center;">
            <h1 style="color:#d4a853;margin:0;font-size:26px;letter-spacing:3px;font-weight:900;">AMD COCOA</h1>
            <p style="color:#a07850;margin:6px 0 0;font-size:13px;letter-spacing:1px;">PREMIUM COCOA PRODUCTS</p>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px;">
            <h2 style="color:#3b1f0a;margin:0 0 12px;font-size:22px;">Verify your email address</h2>
            <p style="color:#7a5c3f;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Welcome to AMD Cocoa! To complete your registration, enter the code below in the verification page. 
              The code is valid for <strong>15 minutes</strong>.
            </p>
            
            <div style="background:#fff;border:2px dashed #d4a853;border-radius:10px;padding:24px;text-align:center;margin:0 0 24px;">
              <p style="color:#a07850;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your code</p>
              <span style="font-size:42px;font-weight:900;letter-spacing:10px;color:#3b1f0a;font-family:'Courier New',monospace;">${code}</span>
            </div>

            <p style="color:#a07850;font-size:13px;line-height:1.6;margin:0;">
              If you did not create an AMD Cocoa account, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f0e6d8;padding:20px 40px;text-align:center;border-top:1px solid #e8d9c8;">
            <p style="color:#a07850;font-size:12px;margin:0;">© ${new Date().getFullYear()} AMD Cocoa. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });

    console.log(`[EMAIL] ✓ Delivered to ${toEmail} (messageId: ${info.messageId})`);
    return true;
  } catch (error: any) {
    console.error('[EMAIL] ✗ Send failed:', error.message);
    console.log('[EMAIL FALLBACK] Use the code logged above to test.');
    return false;
  }
}
