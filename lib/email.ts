import { Resend } from "resend"

const EMAIL_FROM = process.env.EMAIL_FROM ?? "Dropcard <hello@dropcard.co>"

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<{ delivered: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email:dev] password reset link for ${to}: ${resetUrl}`)
    return { delivered: false }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "reset your dropcard password",
    text: `someone requested a password reset for your dropcard account.\n\nset a new password here (valid for 1 hour):\n${resetUrl}\n\nif that wasn't you, ignore this email.`,
  })
  return { delivered: true }
}
