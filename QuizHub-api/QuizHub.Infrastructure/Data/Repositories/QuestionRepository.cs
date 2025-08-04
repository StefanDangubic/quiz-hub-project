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
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        public QuestionRepository(QuizHubDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(int quizId)
        {
            return await _dbSet
                .Where(q => q.QuizId == quizId)
                .OrderBy(q => q.OrderIndex)
                .ToListAsync();
        }

        public async Task<Question?> GetQuestionWithAnswersAsync(int questionId)
        {
            return await _dbSet
                .Include(q => q.Answers.OrderBy(a => a.OrderIndex))
                .FirstOrDefaultAsync(q => q.Id == questionId);
        }

        public async Task<IEnumerable<Question>> GetQuestionsWithAnswersByQuizIdAsync(int quizId)
        {
            return await _dbSet
                .Include(q => q.Answers.OrderBy(a => a.OrderIndex))
                .Where(q => q.QuizId == quizId)
                .OrderBy(q => q.OrderIndex)
                .ToListAsync();
        }
    }
}
