import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, clearError } from '../store/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector(state => state.auth)
  const [form, setForm] = useState({ username: '', password: '' })

  useEffect(() => {
    if (token) navigate('/home')
    return () => dispatch(clearError())
  }, [token])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">⚡</div>
        <h1 className="auth-title">QuizApp</h1>
        <p className="auth-subtitle">Đăng nhập để bắt đầu làm quiz</p>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '10px', fontSize: '0.875rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Nhập username..."
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Nhập mật khẩu..."
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Đang đăng nhập...</>
            ) : '🚀 Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Chưa có tài khoản?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
