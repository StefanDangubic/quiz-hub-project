using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Quiz;
using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Interfaces
{
    public interface IQuizService
    {
        Task<Result<PaginatedResult<QuizDto>>> GetQuizzesAsync(int page = 1, int pageSize = 10, string? searchTerm = null, int? categoryId = null, DifficultyLevel? difficulty = null);
        Task<Result<QuizDto>> GetQuizByIdAsync(int quizId);
        Task<Result<QuizWithQuestionsDto>> GetQuizWithQuestionsAsync(int quizId);
        Task<Result<QuizDto>> CreateQuizAsync(CreateQuizDto createQuizDto, int createdBy);
        Task<Result<QuizDto>> UpdateQuizAsync(int quizId, UpdateQuizDto updateQuizDto, int updatedBy);
        Task<Result> DeleteQuizAsync(int quizId);
        Task<Result<QuizResultDto>> SubmitQuizAsync(SubmitQuizDto submitQuizDto, int userId);
        Task<Result<List<QuizAttemptDto>>> GetUserAttemptsAsync(int userId);
        Task<Result<QuizResultDto>> GetQuizResultAsync(int attemptId, int userId);

        Task<Result<List<UserQuizHistoryDto>>> GetUserQuizHistoryAsync(int userId, int? quizId = null);
        Task<Result<QuizProgressDto>> GetQuizProgressAsync(int userId, int quizId);
    }
}
