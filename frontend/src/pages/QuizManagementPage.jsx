"use client"
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"
import QuizManagement from "../components/admin/QuizManagement"

const QuizManagementPage = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizManagement />
    </div>
  )
}

export default QuizManagementPage
