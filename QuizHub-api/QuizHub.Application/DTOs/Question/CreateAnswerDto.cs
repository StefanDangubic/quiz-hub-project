using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Question
{
    public class CreateAnswerDto
    {
        [Required(ErrorMessage = "Answer text is required")]
        [StringLength(500, MinimumLength = 1, ErrorMessage = "Answer text must be between 1 and 500 characters")]
        public string AnswerText { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }

        public int OrderIndex { get; set; }
    }
}
