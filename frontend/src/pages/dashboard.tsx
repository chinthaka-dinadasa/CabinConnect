import type { User } from '@supabase/supabase-js'
import { useAuth } from '../context/AuthContext'
import { LogoutButton } from '../components/logout-button'

function getWelcomeName(user: User | null): string {
  if (!user) return 'Welcome!'
  const fullName = user.user_metadata.full_name
  if (typeof fullName === 'string' && fullName.trim()) return `Welcome, ${fullName}`
  if (user.email) return `Welcome, ${user.email}`
  return 'Welcome!'
}

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        Loading…
      </div>
    )
  }

  return (
    <div>
      <h1>{getWelcomeName(user)}</h1>
      <LogoutButton />
    </div>
  )
}
