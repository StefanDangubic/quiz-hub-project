using QuizHub.Application.DTOs.Question;
using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Quiz
{
    public class UpdateQuizDto
    {
      //  [Required]
    //    [StringLength(200)]
        public string Title { get; set; } = string.Empty;

      //  [StringLength(1000)]
        public string? Description { get; set; }

//[Required]
        public int CategoryId { get; set; }

     //   [Required]
        public DifficultyLevel DifficultyLevel { get; set; }

        public int TimeLimit { get; set; }

     //   public string? ImageUrl { get; set; }

        public List<UpdateQuestionDto> Questions { get; set; } = new List<UpdateQuestionDto>();
    }
}
