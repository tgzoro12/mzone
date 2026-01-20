import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../../lib/supabase'
import { sendWelcomeEmail } from '../../../lib/email'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([{
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash
      }])
      .select()
      .single()

    if (error) {
      console.error('User creation error:', error)
      return res.status(500).json({ error: 'Failed to create account' })
    }

    // Send welcome email
    await sendWelcomeEmail(normalizedEmail, name)

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
