using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Quiz
{
    public class SubmitQuizDto
    {
        [Required]
        public int QuizId { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Time spent must be non-negative")]
        public int TimeSpent { get; set; }

        [Required]
        public List<SubmitAnswerDto> Answers { get; set; } = new List<SubmitAnswerDto>();
    }

    public class SubmitAnswerDto
    {
        [Required]
        public int QuestionId { get; set; }

        public int? AnswerId { get; set; } // for multiple choice questions

        public List<int> AnswerIds { get; set; } = new List<int>(); // for multiple answer questions

        public string? UserInput { get; set; } // for fill-in-the-blank questions
    }
}
