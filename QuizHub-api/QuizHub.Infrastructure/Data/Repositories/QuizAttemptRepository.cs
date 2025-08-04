using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Interfaces;
using QuizHub.Infrastructure.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Data.Repositories
{
    public class QuizAttemptRepository : Repository<QuizAttempt>, IQuizAttemptRepository
    {
        public QuizAttemptRepository(QuizHubDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<QuizAttempt>> GetUserAttemptsAsync(int userId)
        {
            return await _dbSet
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Category)
                .Where(qa => qa.UserId == userId)
                .OrderByDescending(qa => qa.CompletedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<QuizAttempt>> GetQuizAttemptsAsync(int quizId)
        {
            return await _dbSet
                .Include(qa => qa.User)
                .Where(qa => qa.QuizId == quizId)
                .OrderByDescending(qa => qa.Score)
                .ThenBy(qa => qa.TimeSpent)
                .ToListAsync();
        }

        public async Task<QuizAttempt?> GetAttemptWithAnswersAsync(int attemptId)
        {
            return await _dbSet
                .Include(qa => qa.Quiz)
                .Include(qa => qa.User)
                .Include(qa => qa.UserAnswers)
                    .ThenInclude(ua => ua.Question)
                .Include(qa => qa.UserAnswers)
                    .ThenInclude(ua => ua.Answer)
                .FirstOrDefaultAsync(qa => qa.Id == attemptId);
        }

        public async Task<IEnumerable<QuizAttempt>> GetTopScoresAsync(int quizId, int count = 10)
        {
            return await _dbSet
                .Include(qa => qa.User)
                .Where(qa => qa.QuizId == quizId)
                .OrderByDescending(qa => qa.Score)
                .ThenBy(qa => qa.TimeSpent)
                .ThenBy(qa => qa.CompletedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<QuizAttempt>> GetLeaderboardAsync(int count = 100)
        {
            return await _dbSet
                .Include(qa => qa.User)
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Category)
                .OrderByDescending(qa => qa.Score)
                .ThenBy(qa => qa.TimeSpent)
                .ThenBy(qa => qa.CompletedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}
