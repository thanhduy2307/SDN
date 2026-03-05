import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import AdminPage from './pages/AdminPage'
import AdminQuizDetailPage from './pages/AdminQuizDetailPage'
import UsersPage from './pages/UsersPage'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected: User */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout><HomePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/quiz/:id" element={
          <ProtectedRoute>
            <Layout><QuizPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Protected: Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <Layout><AdminPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/quiz/:id" element={
          <ProtectedRoute adminOnly>
            <Layout><AdminQuizDetailPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute adminOnly>
            <Layout><UsersPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
