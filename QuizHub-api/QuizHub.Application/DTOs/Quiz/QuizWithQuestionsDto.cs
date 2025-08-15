using QuizHub.Application.DTOs.Question;
using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Quiz
{
    public class QuizWithQuestionsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DifficultyLevel DifficultyLevel { get; set; }
        public string DifficultyName => DifficultyLevel.ToString();
        public int TimeLimit { get; set; }
        public bool IsActive { get; set; }
        public string CreatorUsername { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<QuestionWithAnswersDto> Questions { get; set; } = new List<QuestionWithAnswersDto>();
    }
}
