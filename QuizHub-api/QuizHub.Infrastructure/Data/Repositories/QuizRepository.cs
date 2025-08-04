using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Domain.Interfaces;
using QuizHub.Infrastructure.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Data.Repositories
{
    public class QuizRepository : Repository<Quiz>, IQuizRepository
    {
        public QuizRepository(QuizHubDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Quiz>> GetActiveQuizzesAsync()
        {
            return await _dbSet
                .Include(q => q.Category)
                .Include(q => q.Creator)
                .Where(q => q.IsActive)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Quiz>> GetQuizzesByCategoryAsync(int categoryId)
        {
            return await _dbSet
                .Include(q => q.Category)
                .Include(q => q.Creator)
                .Where(q => q.CategoryId == categoryId && q.IsActive)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Quiz>> GetQuizzesByDifficultyAsync(DifficultyLevel difficulty)
        {
            return await _dbSet
                .Include(q => q.Category)
                .Include(q => q.Creator)
                .Where(q => q.DifficultyLevel == difficulty && q.IsActive)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<Quiz?> GetQuizWithQuestionsAsync(int quizId)
        {
            return await _dbSet
                .Include(q => q.Category)
                .Include(q => q.Creator)
                .Include(q => q.Questions.OrderBy(qu => qu.OrderIndex))
                    .ThenInclude(qu => qu.Answers.OrderBy(a => a.OrderIndex))
                .FirstOrDefaultAsync(q => q.Id == quizId);
        }

        public async Task<IEnumerable<Quiz>> SearchQuizzesAsync(string searchTerm)
        {
            return await _dbSet
                .Include(q => q.Category)
                .Include(q => q.Creator)
                .Where(q => q.IsActive &&
                           (q.Title.Contains(searchTerm) ||
                            q.Description!.Contains(searchTerm) ||
                            q.Category.Name.Contains(searchTerm)))
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }
    }
}
