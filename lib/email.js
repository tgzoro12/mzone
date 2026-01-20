import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev'

// Send welcome email after registration
export async function sendWelcomeEmail(email, name) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to Our Platform! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed;">Welcome, ${name}!</h1>
          <p>Thank you for joining our platform. Your account has been created successfully.</p>
          <p>To access premium features, please subscribe to one of our plans.</p>
          <a href="${process.env.NEXTAUTH_URL}/pricing" 
             style="display: inline-block; background: #7c3aed; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            View Plans
          </a>
        </div>
      `
    })
    return { success: true }
  } catch (error) {
    console.error('Welcome email error:', error)
    return { success: false, error }
  }
}

// Send subscription confirmation email
export async function sendSubscriptionEmail(email, name, plan, billing) {
  const planNames = {
    basic: 'Basic',
    pro: 'Pro',
    premium: 'Premium'
  }
  
  const prices = {
    basic: { monthly: '₦7,000', yearly: '₦67,200' },
    pro: { monthly: '₦16,000', yearly: '₦153,600' },
    premium: { monthly: '₦30,000', yearly: '₦270,000' }
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Subscription Confirmed - ${planNames[plan]} Plan 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed;">Subscription Confirmed!</h1>
          <p>Hi ${name},</p>
          <p>Your subscription is now active. Here are your details:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Plan:</strong> ${planNames[plan]}</p>
            <p><strong>Billing:</strong> ${billing === 'yearly' ? 'Yearly' : 'Monthly'}</p>
            <p><strong>Amount:</strong> ${prices[plan][billing]}</p>
          </div>
          
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="display: inline-block; background: #7c3aed; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Go to Dashboard
          </a>
          
          <p style="margin-top: 30px; color: #666;">Thank you for your support!</p>
        </div>
      `
    })
    return { success: true }
  } catch (error) {
    console.error('Subscription email error:', error)
    return { success: false, error }
  }
}

// Send payment failed email
export async function sendPaymentFailedEmail(email, name) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Payment Failed - Action Required ⚠️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">Payment Failed</h1>
          <p>Hi ${name},</p>
          <p>We couldn't process your payment. Please update your payment method to continue your subscription.</p>
          
          <a href="${process.env.NEXTAUTH_URL}/pricing" 
             style="display: inline-block; background: #dc2626; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Update Payment
          </a>
          
          <p style="margin-top: 30px; color: #666;">If you need help, please contact our support team.</p>
        </div>
      `
    })
    return { success: true }
  } catch (error) {
    console.error('Payment failed email error:', error)
    return { success: false, error }
  }
}
