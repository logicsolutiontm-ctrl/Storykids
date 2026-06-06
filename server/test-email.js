import { Resend } from 'resend'

const resend = new Resend('re_your_real_key_here')

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'muhammedgharbii@gmail.com',
  subject: 'StoryKid Test',
  html: '<p>Test email from StoryKid ✅</p>'
})

console.log('DATA:', data)
console.log('ERROR:', error)