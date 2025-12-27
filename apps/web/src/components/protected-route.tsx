import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '@/hooks/use-auth'

export function ProtectedRoute() {
  const { data: user, isLoading, isError } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
