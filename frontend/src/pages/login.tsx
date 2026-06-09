import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const ERRORS = {
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  // AC-4 and AC-5 intentionally use the same message — prevents account enumeration
  INVALID_CREDENTIALS: 'Incorrect email or password.',
  EMAIL_NOT_VERIFIED:
    'Please verify your email before logging in. Check your inbox and spam folder.',
  RATE_LIMITED: 'Too many attempts. Please wait a moment before trying again.',
  GENERIC: 'Something went wrong. Please try again.',
} as const

function mapSignInError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return ERRORS.INVALID_CREDENTIALS
  }
  if (lower.includes('email not confirmed') || lower.includes('not verified')) {
    return ERRORS.EMAIL_NOT_VERIFIED
  }
  if (lower.includes('rate') || lower.includes('too many')) {
    return ERRORS.RATE_LIMITED
  }
  return ERRORS.GENERIC
}

export default function LoginPage() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

    setSubmitting(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setFormError(mapSignInError(error.message))
      } else {
        navigate('/dashboard')
      }
    } catch {
      setFormError(ERRORS.GENERIC)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Log in</h1>
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
            autoComplete="current-password"
          />
          {passwordError && <p role="alert">{passwordError}</p>}
        </div>
        {formError && <p role="alert">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  )
}
