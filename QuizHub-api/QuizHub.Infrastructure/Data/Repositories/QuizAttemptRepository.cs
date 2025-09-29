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
                    .ThenInclude(q => q.Questions) 
                .Include(qa => qa.Quiz.Category)   
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
              .ThenInclude(q => q.Questions)
              .ThenInclude(q => q.Answers)
              .Include(qa => qa.User)
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

        public async Task<IEnumerable<QuizAttempt>> GetLeaderboardAsync(int count = 50)
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

        public async Task<IEnumerable<QuizAttempt>> GetUserQuizHistoryAsync(int userId, int? quizId = null)
        {
            var query = _dbSet
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Category)
                .Where(qa => qa.UserId == userId);

            if (quizId.HasValue)
            {
                query = query.Where(qa => qa.QuizId == quizId.Value);
            }

            return await query
                .OrderByDescending(qa => qa.CompletedAt)
                .ToListAsync();
        }

      

        public async Task<int> GetUserPositionInQuizAsync(int userId, int quizId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _dbSet
                .Where(qa => qa.QuizId == quizId);

            if (fromDate.HasValue)
            {
                query = query.Where(qa => qa.CompletedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(qa => qa.CompletedAt <= toDate.Value);
            }

      
            var userBestAttempt = await query
                .Where(qa => qa.UserId == userId)
                .OrderByDescending(qa => qa.Score)
                .ThenBy(qa => qa.TimeSpent)
                .ThenBy(qa => qa.CompletedAt)
                .FirstOrDefaultAsync();

            if (userBestAttempt == null) return 0;

            
            var bestAttempts = await query
                .GroupBy(qa => qa.UserId)
                .Select(g => g.OrderByDescending(qa => qa.Score)
                             .ThenBy(qa => qa.TimeSpent)
                             .ThenBy(qa => qa.CompletedAt)
                             .First())
                .ToListAsync();

            
            var betterUsersCount = bestAttempts.Count(qa =>
                qa.Score > userBestAttempt.Score ||
                (qa.Score == userBestAttempt.Score && qa.TimeSpent < userBestAttempt.TimeSpent) ||
                (qa.Score == userBestAttempt.Score && qa.TimeSpent == userBestAttempt.TimeSpent && qa.CompletedAt < userBestAttempt.CompletedAt));

            return betterUsersCount + 1;
        }

        public async Task<IEnumerable<QuizAttempt>> GetQuizRankingsAsync(int quizId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _dbSet
                .Include(qa => qa.User)
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Category)
                .Where(qa => qa.QuizId == quizId);

            if (fromDate.HasValue)
                query = query.Where(qa => qa.CompletedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(qa => qa.CompletedAt <= toDate.Value);

            var attempts = await query.ToListAsync();

            var bestAttempts = attempts
                .GroupBy(qa => qa.UserId)
                .Select(g => g.OrderByDescending(qa => qa.Score)
                              .ThenBy(qa => qa.TimeSpent)
                              .ThenBy(qa => qa.CompletedAt)
                              .First())
                .OrderByDescending(qa => qa.Score)
                .ThenBy(qa => qa.TimeSpent)
                .ThenBy(qa => qa.CompletedAt)
                .ToList();

            return bestAttempts;
        }

        public async Task<IEnumerable<QuizAttempt>> GetAllAttemptsForAdminAsync()
        {
            return await _dbSet
                .Include(qa => qa.User)
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Category)
                .OrderByDescending(qa => qa.CompletedAt)
                .ToListAsync();
        }

        public async Task<bool> HasAttemptsForQuizAsync(int quizId)
        {
            return await _context.QuizAttempts.AnyAsync(qa => qa.QuizId == quizId);
        }
    }

}
