import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchQuizzes } from '../store/quizSlice'

const ICONS = ['📚', '🧠', '🌍', '🔬', '🎯', '💡', '🏆', '🎓', '🖥️', '🌟']

export default function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { quizzes, loading, error } = useSelector(state => state.quiz)
  const { isAdmin } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  return (
    <div>
      <div className="home-header">
        <h1>🎮 Danh sách Quiz</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Chọn một quiz để bắt đầu thử thách bản thân
        </p>
        {isAdmin && (
          <button
            className="btn btn-sm mt-2"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', borderRadius: '8px', padding: '0.4rem 1rem', fontWeight: 600 }}
            onClick={() => navigate('/admin')}
          >
            🛠 Quản trị Quiz
          </button>
        )}
      </div>

      <div className="container pb-5">
        {loading && (
          <div className="loading-wrapper">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} />
          </div>
        )}

        {error && (
          <div className="text-center" style={{ color: '#fca5a5' }}>⚠️ {error}</div>
        )}

        {!loading && quizzes.length === 0 && !error && (
          <div className="text-center" style={{ color: 'var(--text-muted)', marginTop: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
            <p>Chưa có quiz nào. {isAdmin ? 'Hãy thêm quiz trong trang quản trị!' : 'Vui lòng quay lại sau.'}</p>
          </div>
        )}

        <div className="row g-4">
          {quizzes.map((quiz, idx) => (
            <div className="col-sm-6 col-lg-4" key={quiz._id}>
              <div className="quiz-card" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                <div className="quiz-card-header">
                  <div className="quiz-card-icon">{ICONS[idx % ICONS.length]}</div>
                  <div className="quiz-card-title">{quiz.title}</div>
                  <div className="quiz-card-desc">{quiz.description}</div>
                </div>
                <div className="quiz-card-footer">
                  <span className="quiz-count-badge">
                    {quiz.questions?.length || 0} câu hỏi
                  </span>
                  <button className="btn-start-quiz">Bắt đầu →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
