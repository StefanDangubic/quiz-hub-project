
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { loadUserFromStorage } from "./store/slices/authSlice"
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Header from "./components/layout/Header"
import AdminDashboardPage from './pages/AdminDashboardPage';
import QuizCreatorPage from './pages/QuizCreatorPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import QuizManagementPage from './pages/QuizManagementPage';
import QuizEditorPage from './pages/QuizEditorPage';
import QuizListPage from './pages/QuizListPage';
import QuizPlayerPage from './pages/QuizPlayerPage'
import QuizResultPage from './pages/QuizResultPage';
import MyResultsPage from './pages/MyResultsPage';
import AdminResultsPage from "./pages/AdminResultsPage"
import SmartRedirect from "./components/auth/SmartRedirect"
import QuizRoomsPage from "./pages/QuizRoomsPage"
import QuizRoomLobbyPage from "./pages/QuizRoomLobbyPage"
import LiveQuizPage from "./pages/LiveQuizPage"

function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [])

 
  return null
}


export default function App() {


  return (
     <Provider store={store}>
      <Router>
        <AuthInitializer /> 
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <QuizListPage />
                  </ProtectedRoute>
                }
              />

                <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute>
                    <QuizPlayerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quiz-result/:attemptId"
                element={
                  <ProtectedRoute>
                    <QuizResultPage />
                  </ProtectedRoute>
                }
              />

               <Route
                path="/my-results"
                element={
                  <ProtectedRoute>
                    <MyResultsPage />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
              path="/quiz-rooms"
              element={
                <ProtectedRoute>
                  <QuizRoomsPage />
                </ProtectedRoute>
              }
            />

             <Route
              path="/quiz-rooms/:roomCode/lobby"
              element={
                <ProtectedRoute>
                  <QuizRoomLobbyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz-rooms/:roomCode/live"
              element={
                <ProtectedRoute>
                  <LiveQuizPage />
                </ProtectedRoute>
              }
            />


             
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/quizzes/create"
                element={
                  <ProtectedRoute adminOnly>
                    <QuizCreatorPage />
                  </ProtectedRoute>
                }
              />

               <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute adminOnly>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/quizzes"
                element={
                  <ProtectedRoute adminOnly>
                    <QuizManagementPage />
                  </ProtectedRoute>
                }
              />

                <Route
                path="/admin/quizzes/edit/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <QuizEditorPage />
                  </ProtectedRoute>
                }
              />

              <Route
              path="/admin/results"
              element={
                <ProtectedRoute adminOnly>
                  <AdminResultsPage />
                </ProtectedRoute>
              }
            />

              
            <Route path="/" element={<SmartRedirect />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
       
      </Router>
     </Provider>
    
  )
}














