import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== 're_123456789' ? new Resend(resendApiKey) : null;

export async function sendSubAdminInviteEmail(params: {
  toEmail: string;
  festName: string;
  inviterName: string;
  inviteUrl: string;
}) {
  if (!resend) {
    console.log(`[EMAIL DEV MODE] Invite email for ${params.toEmail}:
      Fest: ${params.festName}
      Invited by: ${params.inviterName}
      Link: ${params.inviteUrl}`);
    return { success: true, devMode: true };
  }

  try {
    await resend.emails.send({
      from: 'MeeladFest <notifications@meeladfest.com>',
      to: params.toEmail,
      subject: `Invitation to manage ${params.festName} on MeeladFest`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #059669;">MeeladFest Invitation</h2>
          <p>Hello,</p>
          <p><strong>${params.inviterName}</strong> has invited you as a Sub-Admin to help manage <strong>${params.festName}</strong>.</p>
          <p>Please click the button below to sign up / log in and accept your access:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${params.inviteUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
          </div>
          <p style="font-size: 12px; color: #666;">If you did not expect this email, you can safely ignore it.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error('Failed to send invite email via Resend:', err);
    return { success: false, error: err };
  }
}
