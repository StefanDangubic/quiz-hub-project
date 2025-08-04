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
    public class CreateQuizDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Difficulty level is required")]
        public DifficultyLevel DifficultyLevel { get; set; }

        [Required(ErrorMessage = "Time limit is required")]
        [Range(1, 300, ErrorMessage = "Time limit must be between 1 and 300 minutes")]
        public int TimeLimit { get; set; }

        public List<CreateQuestionDto> Questions { get; set; } = new List<CreateQuestionDto>();
    }
}
