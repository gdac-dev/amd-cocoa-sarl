/**
 * Email provider for AMD Cocoa.
 * 
 * Uses Brevo (Sendinblue) HTTP API — works on Vercel (no SMTP needed).
 * Brevo free tier: 300 emails/day, only requires verifying a sender email.
 * 
 * Fallback: Resend (requires verified domain for arbitrary recipients).
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

async function sendViaBrevo(toEmail: string, subject: string, htmlContent: string, textContent: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "arsene.demenou@strivingforall.org";
  const senderName = "AMD Cocoa Sarl";

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject,
      htmlContent,
      textContent,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[EMAIL/BREVO] ✗ HTTP ${response.status}:`, errorBody);
    throw new Error(`Brevo email failed: HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log(`[EMAIL/BREVO] ✓ Sent to ${toEmail} (messageId: ${data.messageId})`);
  return true;
}

async function sendViaResend(toEmail: string, subject: string, htmlContent: string, textContent: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const { data, error } = await resend.emails.send({
    from: `AMD Cocoa Sarl <${fromAddress}>`,
    to: [toEmail],
    subject,
    html: htmlContent,
    text: textContent,
  });

  if (error) {
    console.error("[EMAIL/RESEND] ✗ Error:", JSON.stringify(error));
    throw new Error(`Resend email failed: ${error.message || "Unknown error"}`);
  }

  console.log(`[EMAIL/RESEND] ✓ Sent to ${toEmail} (id: ${data?.id})`);
  return true;
}

/**
 * Sends a 2FA / account verification code.
 * Tries Brevo first (works for any email), falls back to Resend.
 */
export async function send2FACode(toEmail: string, code: string): Promise<boolean> {
  // Always log the code to the terminal for dev visibility
  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  [AMD EMAIL] To: ${toEmail}`);
  console.log(`║  [AMD EMAIL] Code: ${code}`);
  console.log('╚══════════════════════════════════════╝\n');

  const subject = "🍫 AMD Cocoa – Your Verification Code";

  const textContent = `Your verification code is: ${code}\n\nIt expires in 15 minutes. Do not share this code.`;

  const htmlContent = `
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
  `;

  // Check if any email provider is configured
  const hasBrevo = !!process.env.BREVO_API_KEY;
  const hasResend = !!process.env.RESEND_API_KEY;

  if (!hasBrevo && !hasResend) {
    console.warn("[EMAIL] ⚠️  No email provider configured (BREVO_API_KEY or RESEND_API_KEY).");
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email service is not configured. Please contact support.");
    }
    return true; // Don't block UX in development
  }

  // Try Brevo first (works for any email without domain verification)
  if (hasBrevo) {
    try {
      return await sendViaBrevo(toEmail, subject, htmlContent, textContent);
    } catch (err: any) {
      console.error("[EMAIL] Brevo failed, trying Resend fallback:", err.message);
    }
  }

  // Fallback to Resend
  if (hasResend) {
    try {
      return await sendViaResend(toEmail, subject, htmlContent, textContent);
    } catch (err: any) {
      console.error("[EMAIL] Resend also failed:", err.message);
      throw new Error(`Failed to send verification email: ${err.message}`);
    }
  }

  throw new Error("All email providers failed.");
}
