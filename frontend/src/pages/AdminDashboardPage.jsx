import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"
import AdminDashboard from "../components/admin/AdminDashboard"

export default function AdminDashboardPage() {
   const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />
  }


  return (
     <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </div>
    </div>
  )
}
