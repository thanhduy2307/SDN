import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Lấy danh sách quiz
export const fetchQuizzes = createAsyncThunk('quiz/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/quizzes')
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể tải danh sách quiz')
    }
})

// Lấy chi tiết quiz kèm câu hỏi (populate)
export const fetchQuizById = createAsyncThunk('quiz/fetchById', async (quizId, { rejectWithValue }) => {
    try {
        const res = await api.get(`/quizzes/${quizId}`)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể tải quiz')
    }
})

// Tạo quiz mới
export const createQuiz = createAsyncThunk('quiz/create', async (quizData, { rejectWithValue }) => {
    try {
        const res = await api.post('/quizzes', quizData)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể tạo quiz')
    }
})

// Cập nhật quiz
export const updateQuiz = createAsyncThunk('quiz/update', async ({ quizId, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/quizzes/${quizId}`, data)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể cập nhật quiz')
    }
})

// Xóa quiz
export const deleteQuiz = createAsyncThunk('quiz/delete', async (quizId, { rejectWithValue }) => {
    try {
        await api.delete(`/quizzes/${quizId}`)
        return quizId
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể xóa quiz')
    }
})

// Thêm câu hỏi vào quiz
export const addQuestionToQuiz = createAsyncThunk('quiz/addQuestion', async ({ quizId, questionData }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/quizzes/${quizId}/question`, questionData)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể thêm câu hỏi')
    }
})

// Xóa câu hỏi
export const deleteQuestion = createAsyncThunk('quiz/deleteQuestion', async ({ questionId }, { rejectWithValue }) => {
    try {
        await api.delete(`/questions/${questionId}`)
        return questionId
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể xóa câu hỏi')
    }
})

// Cập nhật câu hỏi
export const updateQuestion = createAsyncThunk('quiz/updateQuestion', async ({ questionId, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/questions/${questionId}`, data)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Không thể cập nhật câu hỏi')
    }
})

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        quizzes: [],
        currentQuiz: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentQuiz(state) {
            state.currentQuiz = null
        },
        clearQuizError(state) {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchQuizzes
            .addCase(fetchQuizzes.pending, (state) => { state.loading = true; state.error = null })
            .addCase(fetchQuizzes.fulfilled, (state, action) => { state.loading = false; state.quizzes = action.payload })
            .addCase(fetchQuizzes.rejected, (state, action) => { state.loading = false; state.error = action.payload })
            // fetchQuizById
            .addCase(fetchQuizById.pending, (state) => { state.loading = true; state.error = null })
            .addCase(fetchQuizById.fulfilled, (state, action) => { state.loading = false; state.currentQuiz = action.payload })
            .addCase(fetchQuizById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
            // createQuiz
            .addCase(createQuiz.fulfilled, (state, action) => { state.quizzes.push(action.payload) })
            // updateQuiz
            .addCase(updateQuiz.fulfilled, (state, action) => {
                const idx = state.quizzes.findIndex(q => q._id === action.payload._id)
                if (idx !== -1) state.quizzes[idx] = action.payload
            })
            // deleteQuiz
            .addCase(deleteQuiz.fulfilled, (state, action) => {
                state.quizzes = state.quizzes.filter(q => q._id !== action.payload)
            })
            // addQuestionToQuiz
            .addCase(addQuestionToQuiz.fulfilled, (state, action) => {
                if (state.currentQuiz) {
                    state.currentQuiz = action.payload
                }
            })
            // deleteQuestion
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                if (state.currentQuiz?.questions) {
                    state.currentQuiz.questions = state.currentQuiz.questions.filter(
                        q => (q._id || q) !== action.payload
                    )
                }
            })
    }
})

export const { clearCurrentQuiz, clearQuizError } = quizSlice.actions
export default quizSlice.reducer
