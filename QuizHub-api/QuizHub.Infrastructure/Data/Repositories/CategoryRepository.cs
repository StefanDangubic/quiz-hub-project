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
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(QuizHubDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Category>> GetAllWithQuizCountAsync()
        {
            return await _context.Categories
                .Include(c => c.Quizzes)
                .ToListAsync();
        }

    }
}
