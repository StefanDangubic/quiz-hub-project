using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class QuizRoomQuestionDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public QuestionType QuestionType { get; set; }
        public int Points { get; set; }
        public int QuestionNumber { get; set; }
        public int TotalQuestions { get; set; }
        public int TimeLimit { get; set; } // in seconds
        public List<QuizRoomAnswerOptionDto> Answers { get; set; } = new();
    }

    public class QuizRoomAnswerOptionDto
    {
        public int AnswerId { get; set; }
        public string AnswerText { get; set; } = string.Empty;
    }
}
