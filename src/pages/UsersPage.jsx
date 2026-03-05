import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function UsersPage() {
  const navigate = useNavigate()
  const { isAdmin } = useSelector(state => state.auth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!isAdmin) { navigate('/home'); return }
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="admin-header d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1>👥 Quản lý người dùng</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
            Xem danh sách tất cả tài khoản trong hệ thống
          </p>
        </div>
        <button
          onClick={loadUsers}
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid var(--border)', color: 'var(--primary-light)', borderRadius: '9px', padding: '0.45rem 1rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>TỔNG TÀI KHOẢN</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#e2e8f0' }}>{users.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>ADMIN</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fcd34d' }}>
              {users.filter(u => u.admin).length}
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>USER THƯỜNG</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a5b4fc' }}>
              {users.filter(u => !u.admin).length}
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="loading-wrapper"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>}
      {error && <div className="text-center" style={{ color: '#fca5a5' }}>⚠️ {error}</div>}

      {!loading && !error && (
        <div className="admin-table-container">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Vai trò</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={4} className="text-center" style={{ color: 'var(--text-muted)', padding: '2rem' }}>Chưa có người dùng nào</td></tr>
              )}
              {users.map((user, idx) => (
                <tr key={user._id}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: user.admin ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.95rem', flexShrink: 0
                      }}>
                        {user.admin ? '👑' : '👤'}
                      </div>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{user.username}</span>
                    </div>
                  </td>
                  <td>
                    {user.admin ? (
                      <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', borderRadius: '20px', padding: '0.2rem 0.65rem', fontSize: '0.78rem', fontWeight: 700 }}>
                        Admin
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: 'var(--primary-light)', borderRadius: '20px', padding: '0.2rem 0.65rem', fontSize: '0.78rem', fontWeight: 600 }}>
                        User
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
