using AutoMapper;
using QuizHub.Application.DTOs.Admin;
using QuizHub.Application.DTOs.Auth;
using QuizHub.Application.DTOs.Category;
using QuizHub.Application.DTOs.Leaderboard;
using QuizHub.Application.DTOs.Question;
using QuizHub.Application.DTOs.Quiz;
using QuizHub.Application.DTOs.User;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QuizHub.Application.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) 
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) 
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) 
                .ForMember(dest => dest.Quizzes, opt => opt.Ignore()); 

            // Quiz mappings
            CreateMap<Quiz, QuizDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.CreatorUsername, opt => opt.MapFrom(src => src.Creator.Username))
                .ForMember(dest => dest.QuestionCount, opt => opt.MapFrom(src => src.Questions.Count));

            CreateMap<Quiz, QuizWithQuestionsDto>()
               .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
               .ForMember(dest => dest.CreatorUsername, opt => opt.MapFrom(src => src.Creator.Username))
               .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.OrderBy(q => q.OrderIndex)));

            CreateMap<CreateQuizDto, Quiz>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions));

            // Update Quiz mappings
            CreateMap<UpdateQuizDto, Quiz>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.Creator, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
              //  .ForMember(dest => dest.QuizAttempts, opt => opt.Ignore())
                .ForMember(dest => dest.Questions, opt => opt.Ignore()); // Questions handled separately

            // Question mappings
            CreateMap<Question, QuestionDto>()
                .ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers));

            CreateMap<Question, QuestionWithAnswersDto>()
               .ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers.OrderBy(a => a.OrderIndex)));

            CreateMap<CreateQuestionDto, Question>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers));

            CreateMap<UpdateQuestionDto, Question>()
               .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
               .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
               .ForMember(dest => dest.QuizId, opt => opt.Ignore())
               .ForMember(dest => dest.Quiz, opt => opt.Ignore())
               .ForMember(dest => dest.UserAnswers, opt => opt.Ignore())
               .ForMember(dest => dest.Answers, opt => opt.Ignore()); // Answers handled separately

            // Answer mappings
            CreateMap<Answer, AnswerDto>();
            CreateMap<CreateAnswerDto, Answer>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<UpdateAnswerDto, Answer>()
              .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
              .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
              .ForMember(dest => dest.QuestionId, opt => opt.Ignore())
              .ForMember(dest => dest.Question, opt => opt.Ignore())
              .ForMember(dest => dest.UserAnswers, opt => opt.Ignore());

            // Quiz Attempt mappings
            CreateMap<QuizAttempt, QuizAttemptDto>()
                .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Quiz.Category.Name))
                .ForMember(dest => dest.Percentage, opt => opt.MapFrom(src => src.Percentage));


            CreateMap<QuizAttempt, UserQuizHistoryDto>()
                .ForMember(dest => dest.AttemptId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Quiz.Category.Name))
                .ForMember(dest => dest.Percentage, opt => opt.MapFrom(src => src.Percentage));

           
            CreateMap<QuizAttempt, QuizResultDto>()
               .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
               .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Quiz.Questions.Select(q => new QuestionResultDto
               {
                   QuestionId = q.Id,
                   QuestionText = q.QuestionText,
                   Points = q.Points,
                   IsCorrect = src.UserAnswers.Any(ua => ua.QuestionId == q.Id && ua.IsCorrect),
                   UserAnswer = GetUserAnswerText(q, src.UserAnswers.FirstOrDefault(ua => ua.QuestionId == q.Id)),
                   CorrectAnswer = GetCorrectAnswerText(q)
               })));

            // Admin quiz attempt mapping with user information
            CreateMap<QuizAttempt, AdminQuizAttemptDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Quiz.Category.Name));

            // Leaderboard mappings
            CreateMap<QuizAttempt, LeaderboardEntryDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.ProfileImage, opt => opt.MapFrom(src => src.User.ProfileImage))
                .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Quiz.Category.Name));


        }

        private string GetUserAnswerText(Question question, UserAnswer? userAnswer)
        {
            if (userAnswer == null) return "No answer";

            switch (question.QuestionType)
            {
                case Domain.Enums.QuestionType.SingleChoice:
                case Domain.Enums.QuestionType.TrueFalse:
                    var selectedAnswer = question.Answers.FirstOrDefault(a => a.Id == userAnswer.AnswerId);
                    return selectedAnswer?.AnswerText ?? "No answer";

                case Domain.Enums.QuestionType.MultipleChoice:
                    if (string.IsNullOrEmpty(userAnswer.UserInput)) return "No answer";
                    var answerIds = userAnswer.UserInput.Split(',').Select(int.Parse).ToList();
                    var selectedAnswers = question.Answers.Where(a => answerIds.Contains(a.Id)).Select(a => a.AnswerText);
                    return string.Join(", ", selectedAnswers);

                case Domain.Enums.QuestionType.FillInTheBlank:
                    return userAnswer.UserInput ?? "No answer";

                default:
                    return "No answer";
            }
        }

        private string GetCorrectAnswerText(Question question)
        {
            switch (question.QuestionType)
            {
                case Domain.Enums.QuestionType.SingleChoice:
                case Domain.Enums.QuestionType.TrueFalse:
                case Domain.Enums.QuestionType.FillInTheBlank:
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                    return correctAnswer?.AnswerText ?? "No correct answer";

                case Domain.Enums.QuestionType.MultipleChoice:
                    var correctAnswers = question.Answers.Where(a => a.IsCorrect).Select(a => a.AnswerText);
                    return string.Join(", ", correctAnswers);

                default:
                    return "No correct answer";
            }
        }
    }
}
