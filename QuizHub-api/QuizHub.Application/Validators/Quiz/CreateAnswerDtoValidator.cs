using FluentValidation;
using QuizHub.Application.DTOs.Question;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Validators.Quiz
{
    public class CreateAnswerDtoValidator : AbstractValidator<CreateAnswerDto>
    {
        public CreateAnswerDtoValidator()
        {
            RuleFor(x => x.AnswerText)
                .NotEmpty()
                .WithMessage("Answer text is required")
                .MinimumLength(1)
                .WithMessage("Answer text must be at least 1 character")
                .MaximumLength(500)
                .WithMessage("Answer text cannot exceed 500 characters");

            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Order index must be non-negative");
        }
    }
}
