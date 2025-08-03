using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Interfaces
{
    public interface IQuizAttemptRepository : IRepository<QuizAttempt>
    {
        Task<IEnumerable<QuizAttempt>> GetUserAttemptsAsync(int userId);
        Task<IEnumerable<QuizAttempt>> GetQuizAttemptsAsync(int quizId);
        Task<QuizAttempt?> GetAttemptWithAnswersAsync(int attemptId);
        Task<IEnumerable<QuizAttempt>> GetTopScoresAsync(int quizId, int count = 10);
        Task<IEnumerable<QuizAttempt>> GetLeaderboardAsync(int count = 100);
    }
}
