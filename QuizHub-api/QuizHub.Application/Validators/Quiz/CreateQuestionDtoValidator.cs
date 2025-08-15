using FluentValidation;
using QuizHub.Application.DTOs.Question;
using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Validators.Quiz
{
    public class CreateQuestionDtoValidator : AbstractValidator<CreateQuestionDto>
    {
        public CreateQuestionDtoValidator()
        {
            RuleFor(x => x.QuestionText)
                .NotEmpty()
                .WithMessage("Question text is required")
                .MinimumLength(5)
                .WithMessage("Question text must be at least 5 characters")
                .MaximumLength(1000)
                .WithMessage("Question text cannot exceed 1000 characters");

            RuleFor(x => x.QuestionType)
                .IsInEnum()
                .WithMessage("Invalid question type");

            RuleFor(x => x.Points)
                .GreaterThan(0)
                .WithMessage("Points must be greater than 0")
                .LessThanOrEqualTo(10)
                .WithMessage("Points cannot exceed 10");

            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Order index must be non-negative");

            RuleFor(x => x.Answers)
                .NotEmpty()
                .WithMessage("Question must have at least one answer")
                .Must(HaveValidAnswerCount)
                .WithMessage("Invalid number of answers for question type")
                .Must(HaveAtLeastOneCorrectAnswer)
                .WithMessage("Question must have at least one correct answer");

            RuleForEach(x => x.Answers)
                .SetValidator(new CreateAnswerDtoValidator());
        }

        private bool HaveValidAnswerCount(CreateQuestionDto question, List<CreateAnswerDto> answers)
        {
            return question.QuestionType switch
            {
                QuestionType.SingleChoice => answers.Count >= 2 && answers.Count <= 6,
                QuestionType.MultipleChoice => answers.Count >= 2 && answers.Count <= 6,
                QuestionType.TrueFalse => answers.Count == 2,
                QuestionType.FillInTheBlank => answers.Count == 1,
                _ => false
            };
        }

        private bool HaveAtLeastOneCorrectAnswer(List<CreateAnswerDto> answers)
        {
            return answers.Any(a => a.IsCorrect);
        }
    }
}
