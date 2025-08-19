using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Quiz
{
    public class UserQuizHistoryDto
    {
        public int AttemptId { get; set; }
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public int TimeSpent { get; set; }
        public DateTime CompletedAt { get; set; }
        public int AttemptNumber { get; set; }
        public bool IsPersonalBest { get; set; }
    }
}
