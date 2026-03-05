import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAdmin } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="quiz-navbar navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/home">⚡ QuizApp</Link>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <>
              <Link to="/home" className="nav-link d-none d-md-block">Trang chủ</Link>
              {isAdmin && (
                <>
                  <Link to="/admin" className="nav-link d-none d-md-block">
                    🛠 Quản trị
                  </Link>
                  <Link to="/users" className="nav-link d-none d-md-block">
                    👥 Người dùng
                  </Link>
                </>
              )}
              <span className="user-badge">
                👤 {user.username}
                {isAdmin && <span className="admin-badge">Admin</span>}
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
