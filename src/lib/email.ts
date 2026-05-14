import { Resend } from 'resend';

/**
 * Sends a 2FA / account verification code via Resend (HTTP API).
 * Works on Vercel and all serverless environments — no SMTP ports needed.
 */
export async function send2FACode(toEmail: string, code: string) {
  // Always log the code to the terminal for dev visibility
  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  [AMD EMAIL] To: ${toEmail}`);
  console.log(`║  [AMD EMAIL] Code: ${code}`);
  console.log('╚══════════════════════════════════════╝\n');

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[EMAIL] ⚠️  RESEND_API_KEY not set — email not sent. Code logged above.');
    return true; // Don't block the UX in development
  }

  const resend = new Resend(apiKey);

  const senderName = 'AMD Cocoa Sarl';
  // Use the verified Resend sender — swap with your own domain once verified in Resend dashboard
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const { data, error } = await resend.emails.send({
      from: `${senderName} <${fromAddress}>`,
      to: [toEmail],
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

    if (error) {
      console.error('[EMAIL] ✗ Resend error:', error);
      return false;
    }

    console.log(`[EMAIL] ✓ Delivered to ${toEmail} (id: ${data?.id})`);
    return true;
  } catch (err: any) {
    console.error('[EMAIL] ✗ Send failed:', err.message);
    return false;
  }
}
