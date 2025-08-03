using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Interfaces
{
    public interface IQuestionRepository : IRepository<Question>
    {
        Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(int quizId);
        Task<Question?> GetQuestionWithAnswersAsync(int questionId);
        Task<IEnumerable<Question>> GetQuestionsWithAnswersByQuizIdAsync(int quizId);
    }
}
