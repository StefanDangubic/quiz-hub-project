using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Question
{
    public class UpdateQuestionDto
    {
        public int? Id { get; set; } // Null for new questions

     //   [Required]
      //  [StringLength(1000)]
        public string QuestionText { get; set; } = string.Empty;

     //   [Required]
        public QuestionType QuestionType { get; set; }

    //    [Required]
   //     [Range(1, 100)]
        public int Points { get; set; }

     //   [Required]
        public int OrderIndex { get; set; }

   //     public string? ImageUrl { get; set; }

        public List<UpdateAnswerDto> Answers { get; set; } = new List<UpdateAnswerDto>();
    }
}
