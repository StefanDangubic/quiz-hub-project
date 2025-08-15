using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Question
{
    public class CreateQuestionDto
    {
       // [Required(ErrorMessage = "Question text is required")]
      //  [StringLength(1000, MinimumLength = 5, ErrorMessage = "Question text must be between 5 and 1000 characters")]
        public string QuestionText { get; set; } = string.Empty;

     //   [Required(ErrorMessage = "Question type is required")]
        public QuestionType QuestionType { get; set; }

     //   [Range(1, 10, ErrorMessage = "Points must be between 1 and 10")]
        public int Points { get; set; } = 1;

        public int OrderIndex { get; set; }

        public List<CreateAnswerDto> Answers { get; set; } = new List<CreateAnswerDto>();
    }
}
