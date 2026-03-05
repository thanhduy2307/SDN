import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Thunk: đăng nhập
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post('/users/login', credentials)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại')
    }
})

// Thunk: đăng ký
export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
    try {
        const res = await api.post('/users/signup', userData)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Đăng ký thất bại')
    }
})

// Lấy state ban đầu từ localStorage (persist session)
const storedToken = localStorage.getItem('token')
const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser,
        token: storedToken,
        isAdmin: storedUser?.admin || false,
        loading: false,
        error: null
    },
    reducers: {
        logout(state) {
            state.user = null
            state.token = null
            state.isAdmin = false
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        clearError(state) {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAdmin = action.payload.user.admin
                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('user', JSON.stringify(action.payload.user))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
        // Signup
        builder
            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAdmin = action.payload.user.admin
                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('user', JSON.stringify(action.payload.user))
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
