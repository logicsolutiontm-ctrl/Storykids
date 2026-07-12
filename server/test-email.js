import dotenv from 'dotenv'
import path from 'path'
import { Resend } from 'resend'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })

const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY
const fromEmail = process.env.EMAIL_FROM || process.env.RESEND_FROM || 'StoryKid <info@storykids.fun>'
const toEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || process.env.COMPANY_EMAIL || 'info@storykids.fun'

if (!apiKey) {
  throw new Error('Missing RESEND_API_KEY or RESEND_KEY in environment.')
}

const resend = new Resend(apiKey)

const { data, error } = await resend.emails.send({
  from: fromEmail,
  to: toEmail,
  subject: 'StoryKid Test',
  html: '<p>Test email from StoryKid via Resend ✅</p>',
})

console.log('DATA:', data)
console.log('ERROR:', error)