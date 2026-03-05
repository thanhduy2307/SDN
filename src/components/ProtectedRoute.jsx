import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Bảo vệ route yêu cầu đăng nhập
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, isAdmin } = useSelector(state => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />
  }

  return children
}
