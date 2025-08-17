import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizService } from '../../services/quizService';
import { Quiz } from '../../models/Quiz';

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizzes(params);
      if (response.success) {
        return {
          quizzes: response.data.items.map(quiz => Quiz.fromApiResponse(quiz)),
          totalCount: response.data.totalCount,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages
        };
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchById',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizById(quizId);
      if (response.success) {
        return Quiz.fromApiResponse(response.data);
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quizzes: [],
  currentQuiz: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    categoryId: null,
    difficultyLevel: null,
  },
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.quizzes;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch quiz by ID
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentQuiz, clearError } = quizSlice.actions;
export default quizSlice.reducer;
