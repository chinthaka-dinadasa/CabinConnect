import { useState } from 'react'
import { supabase } from '../lib/supabase'

const LOGOUT_ERROR = 'Logout failed. Please try again.'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setError(LOGOUT_ERROR)
        setLoading(false)
      }
      // Success: Auth Context fires SIGNED_OUT → session null → Protected Route Guard redirects to /login
    } catch {
      setError(LOGOUT_ERROR)
      setLoading(false)
    }
  }

  return (
    <div>
      <button type="button" onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out…' : 'Log out'}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
