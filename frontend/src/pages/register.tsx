import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const ERRORS = {
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  PASSWORD_REQUIRED: 'Password is required.',
  EMAIL_IN_USE: 'An account with this email already exists. Try logging in instead.',
  PASSWORD_TOO_WEAK: 'Password must be at least 6 characters.',
  GENERIC: 'Something went wrong. Please try again.',
  RESEND_SUCCESS: 'Confirmation email resent — check your inbox and spam folder.',
  RESEND_FAILED: 'Failed to resend confirmation email. Please try again.',
} as const

function mapSignUpError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('already registered') || lower.includes('already in use')) {
    return ERRORS.EMAIL_IN_USE
  }
  if (
    lower.includes('password') &&
    (lower.includes('short') || lower.includes('weak') || lower.includes('characters'))
  ) {
    return ERRORS.PASSWORD_TOO_WEAK
  }
  return ERRORS.GENERIC
}

export default function RegisterPage() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState<'form' | 'confirmation'>('form')
  const [resendMessage, setResendMessage] = useState('')

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        Loading…
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  const validateForm = (): boolean => {
    let valid = true

    if (!email.trim()) {
      setEmailError(ERRORS.EMAIL_REQUIRED)
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(ERRORS.EMAIL_INVALID)
      valid = false
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError(ERRORS.PASSWORD_REQUIRED)
      valid = false
    } else {
      setPasswordError('')
    }

    return valid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!validateForm()) return

    // Disabled synchronously before async call begins — prevents duplicate submissions (AC-6)
    setSubmitting(true)

    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setFormError(mapSignUpError(error.message))
      } else {
        setView('confirmation')
      }
    } catch {
      setFormError(ERRORS.GENERIC)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResendMessage('')
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      setResendMessage(error ? ERRORS.RESEND_FAILED : ERRORS.RESEND_SUCCESS)
    } catch {
      setResendMessage(ERRORS.RESEND_FAILED)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (view === 'confirmation') {
    return (
      <div>
        <h1>Check your email</h1>
        <p>
          We sent a confirmation link to <strong>{email}</strong>.
        </p>
        <p>If you don't see it, check your spam folder.</p>
        {resendMessage && <p role="status">{resendMessage}</p>}
        <button type="button" onClick={handleResend}>
          Resend confirmation email
        </button>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1>Create your account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {emailError && <p role="alert">{emailError}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {passwordError && <p role="alert">{passwordError}</p>}
        </div>
        {formError && <p role="alert">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
