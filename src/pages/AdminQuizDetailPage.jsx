import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchQuizById, addQuestionToQuiz } from '../store/quizSlice'
import api from '../services/api'

const emptyForm = {
  text: '',
  options: ['', '', '', ''],
  correctAnswerIndex: 0,
  keywords: ''
}

export default function AdminQuizDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentQuiz, loading } = useSelector(state => state.quiz)

  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null) // null = tạo mới, object = đang sửa
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    dispatch(fetchQuizById(id))
  }, [id, dispatch])

  const handleOptionChange = (idx, value) => {
    const opts = [...form.options]
    opts[idx] = value
    setForm({ ...form, options: opts })
  }

  const openCreate = () => {
    setEditingQuestion(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (q) => {
    setEditingQuestion(q)
    setForm({
      text: q.text,
      options: [...q.options],
      correctAnswerIndex: q.correctAnswerIndex,
      keywords: q.keywords?.join(', ') || ''
    })
    setShowModal(true)
  }

  const handleSaveQuestion = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const questionData = {
        text: form.text,
        options: form.options,
        correctAnswerIndex: parseInt(form.correctAnswerIndex),
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean)
      }

      if (editingQuestion) {
        // Sửa câu hỏi
        await api.put(`/questions/${editingQuestion._id}`, questionData)
      } else {
        // Tạo mới
        await dispatch(addQuestionToQuiz({ quizId: id, questionData })).unwrap()
      }

      setShowModal(false)
      setForm(emptyForm)
      dispatch(fetchQuizById(id)) // Reload
    } catch (err) {
      alert('Lỗi: ' + (err?.message || err))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Xóa câu hỏi này?')) return
    setDeletingId(questionId)
    try {
      await api.delete(`/questions/${questionId}`)
      dispatch(fetchQuizById(id))
    } finally {
      setDeletingId(null)
    }
  }

  const questions = currentQuiz?.questions || []

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate('/admin')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '8px', padding: '0.4rem 0.85rem', cursor: 'pointer' }}>← Quay lại</button>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e2e8f0', marginBottom: 0 }}>
            📝 {currentQuiz?.title || 'Đang tải...'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 0 }}>{currentQuiz?.description}</p>
        </div>
        <button className="btn-add ms-auto" onClick={openCreate}>+ Thêm câu hỏi</button>
      </div>

      {loading && <div className="loading-wrapper"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>}

      {!loading && (
        <div className="admin-table-container">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Câu hỏi &amp; Đáp án</th>
                <th>Đúng</th>
                <th>Từ khóa</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 && (
                <tr><td colSpan={5} className="text-center" style={{ color: 'var(--text-muted)', padding: '2rem' }}>Quiz chưa có câu hỏi nào</td></tr>
              )}
              {questions.map((q, idx) => (
                <tr key={q._id}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{q.text}</div>
                    <div className="d-flex flex-wrap gap-1">
                      {q.options.map((opt, i) => (
                        <span key={i} style={{
                          background: i === q.correctAnswerIndex ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${i === q.correctAnswerIndex ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          color: i === q.correctAnswerIndex ? '#6ee7b7' : 'var(--text-muted)',
                          borderRadius: '6px',
                          padding: '0.15rem 0.5rem',
                          fontSize: '0.75rem'
                        }}>
                          {['A','B','C','D'][i]}. {opt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td><span className="quiz-count-badge">{['A','B','C','D'][q.correctAnswerIndex]}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {q.keywords?.join(', ') || '—'}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', borderRadius: '7px', fontSize: '0.78rem' }}
                        onClick={() => openEdit(q)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '7px', fontSize: '0.78rem' }}
                        onClick={() => handleDeleteQuestion(q._id)}
                        disabled={deletingId === q._id}
                      >
                        {deletingId === q._id ? '...' : '🗑 Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm / Sửa câu hỏi */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingQuestion ? '✏️ Sửa câu hỏi' : '➕ Thêm câu hỏi mới'}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setForm(emptyForm) }} />
              </div>
              <form onSubmit={handleSaveQuestion}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nội dung câu hỏi</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={form.text}
                      onChange={e => setForm({ ...form, text: e.target.value })}
                      required
                      placeholder="Nhập câu hỏi..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Các đáp án (A, B, C, D)</label>
                    <div className="row g-2">
                      {form.options.map((opt, i) => (
                        <div className="col-6" key={i}>
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontWeight: 700, color: 'var(--primary-light)', minWidth: '20px' }}>
                              {['A','B','C','D'][i]}.
                            </span>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={opt}
                              onChange={e => handleOptionChange(i, e.target.value)}
                              required
                              placeholder={`Đáp án ${['A','B','C','D'][i]}...`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Đáp án đúng</label>
                    <select
                      className="form-select"
                      value={form.correctAnswerIndex}
                      onChange={e => setForm({ ...form, correctAnswerIndex: e.target.value })}
                    >
                      {['A','B','C','D'].map((l, i) => (
                        <option key={i} value={i}>Đáp án {l} — {form.options[i] || '(trống)'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Từ khóa <span style={{ color: 'var(--text-muted)' }}>(phân cách bằng dấu phẩy, không bắt buộc)</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.keywords}
                      onChange={e => setForm({ ...form, keywords: e.target.value })}
                      placeholder="vd: địa lý, việt nam, thủ đô"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowModal(false); setForm(emptyForm) }}>Hủy</button>
                  <button type="submit" className="btn btn-sm" style={{ background: 'var(--primary)', color: '#fff', borderRadius: '7px', fontWeight: 600 }} disabled={saving}>
                    {saving ? 'Đang lưu...' : (editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi')}
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
