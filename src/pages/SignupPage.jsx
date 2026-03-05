import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser, clearError } from '../store/authSlice'

export default function SignupPage() {
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
    dispatch(signupUser(form))
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">📝</div>
        <h1 className="auth-title">Tạo tài khoản</h1>
        <p className="auth-subtitle">Đăng ký để tham gia QuizApp</p>

        {error && (
          <div className="mb-3" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '10px', padding: '0.5rem 0.85rem', fontSize: '0.875rem' }}>
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
              placeholder="Chọn username..."
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
              placeholder="Chọn mật khẩu..."
              value={form.password}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>
          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Đang đăng ký...</>
            ) : '✅ Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
