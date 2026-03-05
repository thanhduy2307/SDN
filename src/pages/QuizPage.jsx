import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchQuizById, clearCurrentQuiz } from '../store/quizSlice'

export default function QuizPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentQuiz, loading, error } = useSelector(state => state.quiz)

  const [answers, setAnswers] = useState({})       // { questionIndex: optionIndex }
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    dispatch(fetchQuizById(id))
    return () => dispatch(clearCurrentQuiz())
  }, [id, dispatch])

  const questions = currentQuiz?.questions || []

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) correct++
    })
    setScore(correct)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const answeredCount = Object.keys(answers).length
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0
  const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner-border" style={{ color: 'var(--primary)' }} />
    </div>
  )

  if (error) return (
    <div className="container py-5 text-center" style={{ color: '#fca5a5' }}>
      ⚠️ {error} <br />
      <button className="btn mt-3" style={{ color: 'var(--primary-light)', border: '1px solid var(--border)' }} onClick={() => navigate('/home')}>← Quay lại</button>
    </div>
  )

  // Màn hình kết quả
  if (submitted) {
    const grade = scorePct >= 80 ? { icon: '🏆', msg: 'Xuất sắc!', color: '#10b981' }
                 : scorePct >= 60 ? { icon: '👍', msg: 'Khá tốt!', color: '#6366f1' }
                 : { icon: '💪', msg: 'Cố gắng thêm!', color: '#f59e0b' }
    return (
      <div className="container quiz-page-wrapper">
        <div className="result-card">
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{grade.icon}</div>
          <h2 style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '0.25rem' }}>{grade.msg}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{currentQuiz?.title}</p>

          <div
            className="result-score-circle"
            style={{ '--pct': `${scorePct * 3.6}deg`, background: `conic-gradient(${grade.color} ${scorePct * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
          >
            {score}/{questions.length}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem' }}>
            Bạn trả lời đúng <strong style={{ color: grade.color }}>{scorePct}%</strong> câu hỏi
          </p>

          {/* Chi tiết đáp án */}
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            {questions.map((q, qIdx) => {
              const userAns = answers[qIdx]
              const isCorrect = userAns === q.correctAnswerIndex
              return (
                <div key={q._id} style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '10px', background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  <div style={{ fontSize: '0.82rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    {isCorrect ? '✅' : '❌'} Câu {qIdx + 1}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '0.25rem' }}>{q.text}</div>
                  {!isCorrect && (
                    <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>
                      Đáp án đúng: {q.options[q.correctAnswerIndex]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <button className="btn-primary-custom" style={{ width: 'auto', padding: '0.6rem 1.5rem' }} onClick={() => { setSubmitted(false); setAnswers({}) }}>
              🔄 Làm lại
            </button>
            <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '10px', padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>
              ← Về trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container quiz-page-wrapper">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '8px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}>←</button>
        <div>
          <h2 style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: 0, fontSize: '1.3rem' }}>{currentQuiz?.title}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{currentQuiz?.description}</div>
        </div>
        <div className="ms-auto" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          {answeredCount}/{questions.length} đã trả lời
        </div>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-bar-container">
        <div className="quiz-progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {questions.length === 0 && (
        <div className="text-center" style={{ color: 'var(--text-muted)', marginTop: '3rem' }}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <p>Quiz này chưa có câu hỏi nào.</p>
        </div>
      )}

      {/* Questions */}
      {questions.map((q, qIdx) => (
        <div key={q._id} className="question-card">
          <div className="question-number">Câu {qIdx + 1} / {questions.length}</div>
          <div className="question-text">{q.text}</div>
          {q.options.map((opt, optIdx) => (
            <button
              key={optIdx}
              className={`option-btn ${answers[qIdx] === optIdx ? 'selected' : ''}`}
              onClick={() => handleSelect(qIdx, optIdx)}
            >
              <span style={{ fontWeight: 700, marginRight: '0.6rem', color: 'var(--primary-light)' }}>
                {['A', 'B', 'C', 'D'][optIdx]}.
              </span>
              {opt}
            </button>
          ))}
        </div>
      ))}

      {/* Submit */}
      {questions.length > 0 && (
        <div className="text-center pb-4">
          <button
            className="btn-primary-custom"
            style={{ width: 'auto', padding: '0.75rem 2.5rem' }}
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
          >
            {answeredCount < questions.length
              ? `Trả lời thêm ${questions.length - answeredCount} câu nữa`
              : '✅ Nộp bài'}
          </button>
        </div>
      )}
    </div>
  )
}
