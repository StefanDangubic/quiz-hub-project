using AutoMapper;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Question;
using QuizHub.Application.DTOs.Quiz;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Implementations
{
    public class QuizService : IQuizService
    {


        private readonly IQuizRepository _quizRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IQuizAttemptRepository _quizAttemptRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IMapper _mapper;

        public QuizService(
            IQuizRepository quizRepository,
            IQuestionRepository questionRepository,
            IQuizAttemptRepository quizAttemptRepository,
            IRepository<Category> categoryRepository,
            IMapper mapper)
        {
            _quizRepository = quizRepository;
            _questionRepository = questionRepository;
            _quizAttemptRepository = quizAttemptRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }


        public async Task<Result<QuizDto>> CreateQuizAsync(CreateQuizDto createQuizDto, int createdBy)
        {
            try
            {
               
                bool categoryExists = await _categoryRepository.ExistsAsync(c => c.Id == createQuizDto.CategoryId);
                if (!categoryExists)
                {
                    return Result<QuizDto>.Failure("Selected category does not exist");
                }


                var quiz = _mapper.Map<Quiz>(createQuizDto);
                quiz.CreatedBy = createdBy;
                quiz.IsActive = true;

                quiz = await _quizRepository.AddAsync(quiz);
                var quizDto = _mapper.Map<QuizDto>(quiz);

                return Result<QuizDto>.Success(quizDto, "Quiz created successfully");
            }
            catch (Exception ex)
            {
                return Result<QuizDto>.Failure($"Error creating quiz: {ex.Message}");
            }
        }



        public async Task<Result<PaginatedResult<QuizDto>>> GetQuizzesAsync(int page = 1, int pageSize = 10, string? searchTerm = null, int? categoryId = null, DifficultyLevel? difficulty = null)
        {
            try
            {
                // Start with all active quizzes
                var quizzes = await _quizRepository.GetActiveQuizzesAsync();

                // Apply search filter if provided
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    var searchResults = await _quizRepository.SearchQuizzesAsync(searchTerm);
                    quizzes = quizzes.Intersect(searchResults);
                }

                // Apply category filter if provided
                if (categoryId.HasValue)
                {
                    quizzes = quizzes.Where(q => q.CategoryId == categoryId.Value);
                }

                // Apply difficulty filter if provided
                if (difficulty.HasValue)
                {
                    quizzes = quizzes.Where(q => q.DifficultyLevel == difficulty.Value);
                }

                var totalCount = quizzes.Count();
                var pagedQuizzes = quizzes
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var quizDtos = _mapper.Map<List<QuizDto>>(pagedQuizzes);
                var paginatedResult = new PaginatedResult<QuizDto>(quizDtos, totalCount, page, pageSize);

                return Result<PaginatedResult<QuizDto>>.Success(paginatedResult);
            }
            catch (Exception ex)
            {
                return Result<PaginatedResult<QuizDto>>.Failure($"Error retrieving quizzes: {ex.Message}");
            }
        }



       

        public async Task<Result<QuizDto>> GetQuizByIdAsync(int quizId)
        {
            try
            {
                var quiz = await _quizRepository.GetByIdAsync(quizId);
                if (quiz == null)
                {
                    return Result<QuizDto>.Failure("Quiz not found");
                }

                var quizDto = _mapper.Map<QuizDto>(quiz);
                return Result<QuizDto>.Success(quizDto);
            }
            catch (Exception ex)
            {
                return Result<QuizDto>.Failure($"Error retrieving quiz: {ex.Message}");
            }
        }

        public async Task<Result<QuizWithQuestionsDto>> GetQuizWithQuestionsAsync(int quizId)
        {
            try
            {
                var quiz = await _quizRepository.GetQuizWithQuestionsAsync(quizId);
                if (quiz == null)
                {
                    return Result<QuizWithQuestionsDto>.Failure("Quiz not found");
                }

                var quizDto = _mapper.Map<QuizWithQuestionsDto>(quiz);
                return Result<QuizWithQuestionsDto>.Success(quizDto);
            }
            catch (Exception ex)
            {
                return Result<QuizWithQuestionsDto>.Failure($"Error retrieving quiz with questions: {ex.Message}");
            }
        }

        public async Task<Result<QuizDto>> UpdateQuizAsync(int quizId, UpdateQuizDto updateQuizDto, int updatedBy)
        {
            try
            {
                var existingQuiz = await _quizRepository.GetQuizWithQuestionsAsync(quizId);
                if (existingQuiz == null)
                {
                    return Result<QuizDto>.Failure("Quiz not found");
                }

                // Map basic quiz properties using AutoMapper
                _mapper.Map(updateQuizDto, existingQuiz);
                existingQuiz.UpdatedBy = updatedBy;

                // Map questions and answers
                var updatedQuestions = new List<Question>();
                foreach (var questionDto in updateQuizDto.Questions)
                {
                    var question = _mapper.Map<Question>(questionDto);

                    // Map answers
                    question.Answers = questionDto.Answers.Select(answerDto =>
                        _mapper.Map<Answer>(answerDto)).ToList();

                    updatedQuestions.Add(question);
                }

                existingQuiz.Questions = updatedQuestions;

                // Use repository method to handle complex update
                await _quizRepository.UpdateQuizWithQuestionsAsync(existingQuiz);

                var quizDto = _mapper.Map<QuizDto>(existingQuiz);
                return Result<QuizDto>.Success(quizDto, "Quiz updated successfully");
            }
            catch (Exception ex)
            {
                return Result<QuizDto>.Failure($"Error updating quiz: {ex.Message}");
            }
        }


        
        public async Task<Result> DeleteQuizAsync(int quizId)
        {
            try
            {
                var quiz = await _quizRepository.GetByIdAsync(quizId);
                if (quiz == null)
                {
                    return Result.Failure("Quiz not found");
                }

                await _quizRepository.DeleteAsync(quiz);

                return Result.Success("Quiz deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting quiz: {ex.Message}");
            }
        }

        public async Task<Result<QuizResultDto>> SubmitQuizAsync(SubmitQuizDto submitQuizDto, int userId)
        {
            try
            {
                var quiz = await _quizRepository.GetQuizWithQuestionsAsync(submitQuizDto.QuizId);
                if (quiz == null)
                {
                    return Result<QuizResultDto>.Failure("Quiz not found");
                }

                // Calculate score
                int totalScore = 0;
                int maxScore = quiz.Questions.Sum(q => q.Points);
                var userAnswers = new List<UserAnswer>();

                foreach (var question in quiz.Questions)
                {
                    var submittedAnswer = submitQuizDto.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
                    if (submittedAnswer == null) continue;

                    bool isCorrect = false;
                    UserAnswer userAnswer;

                    switch (question.QuestionType)
                    {
                        case QuestionType.SingleChoice:
                        case QuestionType.TrueFalse:
                            var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                            isCorrect = correctAnswer != null && correctAnswer.Id == submittedAnswer.AnswerId;
                            userAnswer = new UserAnswer
                            {
                                QuestionId = question.Id,
                                AnswerId = submittedAnswer.AnswerId,
                                IsCorrect = isCorrect
                            };
                            break;

                        case QuestionType.MultipleChoice:
                            var correctAnswerIds = question.Answers.Where(a => a.IsCorrect).Select(a => a.Id).ToList();
                            isCorrect = correctAnswerIds.Count == submittedAnswer.AnswerIds.Count &&
                                       correctAnswerIds.All(id => submittedAnswer.AnswerIds.Contains(id));
                            userAnswer = new UserAnswer
                            {
                                QuestionId = question.Id,
                                UserInput = string.Join(",", submittedAnswer.AnswerIds),
                                IsCorrect = isCorrect
                            };
                            break;

                        case QuestionType.FillInTheBlank:
                            var correctText = question.Answers.FirstOrDefault(a => a.IsCorrect)?.AnswerText?.Trim().ToLower();
                            var userText = submittedAnswer.UserInput?.Trim().ToLower();
                            isCorrect = !string.IsNullOrEmpty(correctText) && correctText == userText;
                            userAnswer = new UserAnswer
                            {
                                QuestionId = question.Id,
                                UserInput = submittedAnswer.UserInput,
                                IsCorrect = isCorrect
                            };
                            break;

                        default:
                            continue;
                    }

                    if (isCorrect)
                    {
                        totalScore += question.Points;
                    }

                    userAnswers.Add(userAnswer);
                }

                // Create quiz attempt
                var quizAttempt = new QuizAttempt
                {
                    UserId = userId,
                    QuizId = submitQuizDto.QuizId,
                    Score = totalScore,
                    MaxScore = maxScore,
                    TimeSpent = submitQuizDto.TimeSpent,
                    CompletedAt = DateTime.UtcNow,
                    UserAnswers = userAnswers
                };

                quizAttempt = await _quizAttemptRepository.AddAsync(quizAttempt);

                // Create result DTO
                var resultDto = new QuizResultDto
                {
                    AttemptId = quizAttempt.Id,
                    QuizId = quiz.Id,
                    QuizTitle = quiz.Title,
                    Score = totalScore,
                    MaxScore = maxScore,
                    Percentage = quizAttempt.Percentage,
                    TimeSpent = submitQuizDto.TimeSpent,
                    CompletedAt = quizAttempt.CompletedAt,
                    Questions = quiz.Questions.Select(q => new QuestionResultDto
                    {
                        QuestionId = q.Id,
                        QuestionText = q.QuestionText,
                        IsCorrect = userAnswers.FirstOrDefault(ua => ua.QuestionId == q.Id)?.IsCorrect ?? false,
                        UserAnswer = GetUserAnswerText(q, userAnswers.FirstOrDefault(ua => ua.QuestionId == q.Id)),
                        CorrectAnswer = GetCorrectAnswerText(q),
                        Points = q.Points
                    }).ToList()
                };

                return Result<QuizResultDto>.Success(resultDto, "Quiz submitted successfully");
            }
            catch (Exception ex)
            {
                return Result<QuizResultDto>.Failure($"Error submitting quiz: {ex.Message}");
            }
        }

        public async Task<Result<List<QuizAttemptDto>>> GetUserAttemptsAsync(int userId)
        {
            try
            {
                var attempts = await _quizAttemptRepository.GetUserAttemptsAsync(userId);
                var attemptDtos = _mapper.Map<List<QuizAttemptDto>>(attempts);

                return Result<List<QuizAttemptDto>>.Success(attemptDtos);
            }
            catch (Exception ex)
            {
                return Result<List<QuizAttemptDto>>.Failure($"Error retrieving user attempts: {ex.Message}");
            }
        }

        public async Task<Result<QuizResultDto>> GetQuizResultAsync(int attemptId, int userId)
        {
            try
            {
                var attempt = await _quizAttemptRepository.GetAttemptWithAnswersAsync(attemptId);
                if (attempt == null || attempt.UserId != userId)
                {
                    return Result<QuizResultDto>.Failure("Quiz result not found");
                }

                var resultDto = _mapper.Map<QuizResultDto>(attempt);
                return Result<QuizResultDto>.Success(resultDto);
            }
            catch (Exception ex)
            {
                return Result<QuizResultDto>.Failure($"Error retrieving quiz result: {ex.Message}");
            }
        }

        private string GetUserAnswerText(Question question, UserAnswer? userAnswer)
        {
            if (userAnswer == null) return "No answer";

            switch (question.QuestionType)
            {
                case QuestionType.SingleChoice:
                case QuestionType.TrueFalse:
                    var selectedAnswer = question.Answers.FirstOrDefault(a => a.Id == userAnswer.AnswerId);
                    return selectedAnswer?.AnswerText ?? "No answer";

                case QuestionType.MultipleChoice:
                    if (string.IsNullOrEmpty(userAnswer.UserInput)) return "No answer";
                    var answerIds = userAnswer.UserInput.Split(',').Select(int.Parse).ToList();
                    var selectedAnswers = question.Answers.Where(a => answerIds.Contains(a.Id)).Select(a => a.AnswerText);
                    return string.Join(", ", selectedAnswers);

                case QuestionType.FillInTheBlank:
                    return userAnswer.UserInput ?? "No answer";

                default:
                    return "No answer";
            }
        }

        private string GetCorrectAnswerText(Question question)
        {
            switch (question.QuestionType)
            {
                case QuestionType.SingleChoice:
                case QuestionType.TrueFalse:
                case QuestionType.FillInTheBlank:
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                    return correctAnswer?.AnswerText ?? "No correct answer";

                case QuestionType.MultipleChoice:
                    var correctAnswers = question.Answers.Where(a => a.IsCorrect).Select(a => a.AnswerText);
                    return string.Join(", ", correctAnswers);

                default:
                    return "No correct answer";
            }
        }
    }
}
