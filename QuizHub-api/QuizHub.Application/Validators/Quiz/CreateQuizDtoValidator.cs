using FluentValidation;
using QuizHub.Application.DTOs.Quiz;
using QuizHub.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Validators.Quiz
{
    public class CreateQuizDtoValidator : AbstractValidator<CreateQuizDto>
    {
        private readonly IRepository<Domain.Entities.Category> _categoryRepository;

        public CreateQuizDtoValidator(IRepository<Domain.Entities.Category> categoryRepository)
        {
            _categoryRepository = categoryRepository;

            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Quiz title is required")
                .MinimumLength(3)
                .WithMessage("Quiz title must be at least 3 characters")
                .MaximumLength(200)
                .WithMessage("Quiz title cannot exceed 200 characters");

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .WithMessage("Description cannot exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage("Category is required");
               

            RuleFor(x => x.DifficultyLevel)
                .IsInEnum()
                .WithMessage("Invalid difficulty level");

            RuleFor(x => x.TimeLimit)
                .GreaterThan(0)
                .WithMessage("Time limit must be greater than 0")
                .LessThanOrEqualTo(300)
                .WithMessage("Time limit cannot exceed 300 minutes");

            RuleFor(x => x.Questions)
                .NotEmpty()
                .WithMessage("Quiz must have at least one question")
                .Must(x => x.Count >= 1)
                .WithMessage("Quiz must have at least one question")
                .Must(x => x.Count <= 50)
                .WithMessage("Quiz cannot have more than 50 questions");

            RuleForEach(x => x.Questions)
                .SetValidator(new CreateQuestionDtoValidator());
        }

      
    }
}
