import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { leaderboardService } from "../../services/leaderboardService"

export const fetchGlobalLeaderboard = createAsyncThunk(
  "leaderboard/fetchGlobal",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getGlobalLeaderboard(params)
      if (response.success) {
        return response.data
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchUserPosition = createAsyncThunk(
  "leaderboard/fetchUserPosition",
  async ({ params }, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getUserPosition(params)
      if (response.success) {
        return response.data
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchQuizzesForFilter = createAsyncThunk(
  "leaderboard/fetchQuizzesForFilter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getQuizzesForFilter()
      if (response.success) {
        return response.data
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  globalLeaderboard: [],
  userPosition: null,
  availableQuizzes: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    quizId: null,
    timePeriod: "all", // all, weekly, monthly
  },
}

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
    resetLeaderboard: (state) => {
      state.globalLeaderboard = []
      state.userPosition = null
      state.currentPage = 1
      state.totalPages = 0
      state.totalCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch global leaderboard
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.loading = false
        state.globalLeaderboard = action.payload.items || action.payload
        state.totalCount = action.payload.totalCount || 0
        state.currentPage = action.payload.currentPage || 1
        state.totalPages = action.payload.totalPages || 0
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch user position
      .addCase(fetchUserPosition.fulfilled, (state, action) => {
        state.userPosition = action.payload
      })
      // Fetch quizzes for filter
      .addCase(fetchQuizzesForFilter.fulfilled, (state, action) => {
        state.availableQuizzes = action.payload.items
      })
  },
})

export const { setFilters, clearError, resetLeaderboard } = leaderboardSlice.actions
export default leaderboardSlice.reducer
