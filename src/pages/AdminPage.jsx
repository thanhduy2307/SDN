import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../store/quizSlice'

export default function AdminPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { quizzes, loading } = useSelector(state => state.quiz)

  const [showModal, setShowModal] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [form, setForm] = useState({ title: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  const openCreate = () => {
    setEditingQuiz(null)
    setForm({ title: '', description: '' })
    setShowModal(true)
  }

  const openEdit = (quiz) => {
    setEditingQuiz(quiz)
    setForm({ title: quiz.title, description: quiz.description })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingQuiz) {
        await dispatch(updateQuiz({ quizId: editingQuiz._id, data: form })).unwrap()
      } else {
        await dispatch(createQuiz(form)).unwrap()
      }
      setShowModal(false)
    } catch (err) {
      alert('Lỗi: ' + err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (quizId) => {
    if (!window.confirm('Bạn có chắc muốn xóa quiz này?')) return
    setDeleteId(quizId)
    try {
      await dispatch(deleteQuiz(quizId)).unwrap()
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="container py-4">
      <div className="admin-header d-flex align-items-center justify-content-between">
        <h1>🛠 Quản trị Quiz</h1>
        <button className="btn-add" onClick={openCreate}>+ Thêm Quiz</button>
      </div>

      {loading ? (
        <div className="loading-wrapper"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>
      ) : (
        <div className="admin-table-container">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Câu hỏi</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length === 0 && (
                <tr><td colSpan={5} className="text-center" style={{ color: 'var(--text-muted)', padding: '2rem' }}>Chưa có quiz nào</td></tr>
              )}
              {quizzes.map((quiz, idx) => (
                <tr key={quiz._id}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{quiz.title}</td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: '200px' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {quiz.description}
                    </span>
                  </td>
                  <td>
                    <span className="quiz-count-badge">{quiz.questions?.length || 0} câu</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--primary-light)', borderRadius: '7px', fontSize: '0.78rem' }}
                        onClick={() => navigate(`/admin/quiz/${quiz._id}`)}
                      >
                        📝 Câu hỏi
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', borderRadius: '7px', fontSize: '0.78rem' }}
                        onClick={() => openEdit(quiz)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '7px', fontSize: '0.78rem' }}
                        onClick={() => handleDelete(quiz._id)}
                        disabled={deleteId === quiz._id}
                      >
                        {deleteId === quiz._id ? '...' : '🗑 Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingQuiz ? '✏️ Sửa Quiz' : '➕ Tạo Quiz Mới'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="Nhập tiêu đề quiz..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      required
                      placeholder="Mô tả ngắn về quiz..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-sm" style={{ background: 'var(--primary)', color: '#fff', borderRadius: '7px', fontWeight: 600 }} disabled={saving}>
                    {saving ? 'Đang lưu...' : (editingQuiz ? 'Cập nhật' : 'Tạo Quiz')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
