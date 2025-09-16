using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Interfaces
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        Task<IEnumerable<Quiz>> GetActiveQuizzesAsync();
        Task<IEnumerable<Quiz>> GetQuizzesByCategoryAsync(int categoryId);
        Task<IEnumerable<Quiz>> GetQuizzesByDifficultyAsync(DifficultyLevel difficulty);
        Task<Quiz?> GetQuizWithQuestionsAsync(int quizId);
        Task<IEnumerable<Quiz>> SearchQuizzesAsync(string searchTerm);
        Task UpdateQuizWithQuestionsAsync(Quiz quiz);
        Task<IEnumerable<Quiz>> GetAllWithCategoryAsync();
    }
}
