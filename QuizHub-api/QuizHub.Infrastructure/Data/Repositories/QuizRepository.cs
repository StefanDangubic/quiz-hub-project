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
                 .Include(q => q.Questions)
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

        public async Task UpdateQuizWithQuestionsAsync(Quiz quiz)
        {
            // Get existing quiz with all related data
            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qu => qu.Answers)
                .FirstOrDefaultAsync(q => q.Id == quiz.Id);

            if (existingQuiz == null)
                throw new InvalidOperationException("Quiz not found");

            // Update quiz properties
            _context.Entry(existingQuiz).CurrentValues.SetValues(quiz);

            // Handle questions
            await UpdateQuestionsAsync(existingQuiz, quiz.Questions.ToList());

            await _context.SaveChangesAsync();
        }

        private async Task UpdateQuestionsAsync(Quiz existingQuiz, List<Question> newQuestions)
        {
            // Get existing question IDs
            var existingQuestionIds = existingQuiz.Questions.Select(q => q.Id).ToList();
            var newQuestionIds = newQuestions.Where(q => q.Id > 0).Select(q => q.Id).ToList();

            // Remove questions that are not in the new list
            var questionsToRemove = existingQuiz.Questions
                .Where(q => !newQuestionIds.Contains(q.Id))
                .ToList();

            foreach (var questionToRemove in questionsToRemove)
            {
                _context.Questions.Remove(questionToRemove);
            }

            // Update existing questions and add new ones
            foreach (var newQuestion in newQuestions)
            {
                if (newQuestion.Id > 0)
                {
                    // Update existing question
                    var existingQuestion = existingQuiz.Questions
                        .FirstOrDefault(q => q.Id == newQuestion.Id);

                    if (existingQuestion != null)
                    {
                        _context.Entry(existingQuestion).CurrentValues.SetValues(newQuestion);
                        await UpdateAnswersAsync(existingQuestion, newQuestion.Answers.ToList());
                    }
                }
                else
                {
                    // Add new question
                    newQuestion.QuizId = existingQuiz.Id;
                    existingQuiz.Questions.Add(newQuestion);
                }
            }
        }

        public async Task<IEnumerable<Quiz>> GetAllWithCategoryAsync()
        {
            return await _dbSet
                .Include(q => q.Category)
                .Where(q => q.IsActive)
                .OrderBy(q => q.Category.Name)
                .ThenBy(q => q.Title)
                .ToListAsync();
        }


        private async Task UpdateAnswersAsync(Question existingQuestion, List<Answer> newAnswers)
        {
            // Get existing answer IDs
            var existingAnswerIds = existingQuestion.Answers.Select(a => a.Id).ToList();
            var newAnswerIds = newAnswers.Where(a => a.Id > 0).Select(a => a.Id).ToList();

            // Remove answers that are not in the new list
            var answersToRemove = existingQuestion.Answers
                .Where(a => !newAnswerIds.Contains(a.Id))
                .ToList();

            foreach (var answerToRemove in answersToRemove)
            {
                _context.Answers.Remove(answerToRemove);
            }

            // Update existing answers and add new ones
            foreach (var newAnswer in newAnswers)
            {
                if (newAnswer.Id > 0)
                {
                    // Update existing answer
                    var existingAnswer = existingQuestion.Answers
                        .FirstOrDefault(a => a.Id == newAnswer.Id);

                    if (existingAnswer != null)
                    {
                        _context.Entry(existingAnswer).CurrentValues.SetValues(newAnswer);
                    }
                }
                else
                {
                    // Add new answer
                    newAnswer.QuestionId = existingQuestion.Id;
                    existingQuestion.Answers.Add(newAnswer);
                }
            }
        }
    }
}
