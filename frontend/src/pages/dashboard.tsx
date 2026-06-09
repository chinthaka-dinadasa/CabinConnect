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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-body-md text-body-md text-secondary">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed top nav */}
      <header className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-margin-mobile md:px-margin-desktop bg-surface border-b border-outline-variant">
        <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          CabinConnect
        </span>
        <LogoutButton />
      </header>

      {/* Main content — pt-16 clears the fixed nav */}
      <main className="pt-16 flex flex-col items-center justify-center min-h-screen px-margin-mobile">
        <div className="text-center">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-md break-all">
            {getWelcomeName(user)}
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Your cabin hub is ready.
          </p>
        </div>
      </main>
    </div>
  )
}
