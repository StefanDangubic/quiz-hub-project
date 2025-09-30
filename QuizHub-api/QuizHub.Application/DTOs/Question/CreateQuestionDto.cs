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
       
        public string QuestionText { get; set; } = string.Empty;
   
        public QuestionType QuestionType { get; set; }

        public int Points { get; set; } = 1;

        public int OrderIndex { get; set; }

        public List<CreateAnswerDto> Answers { get; set; } = new List<CreateAnswerDto>();
    }
}
