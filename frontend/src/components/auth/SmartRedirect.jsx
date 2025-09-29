import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const SmartRedirect = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on user role
  if (user?.role === 2) {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/dashboard" replace />
}

export default SmartRedirect
