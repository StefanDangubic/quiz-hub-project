using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Leaderboard
{
    public class UserStatsDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int TotalQuizzesTaken { get; set; }
        public List<QuizStatsDto> RecentQuizzes { get; set; } = new List<QuizStatsDto>();
        public List<CategoryStatsDto> CategoryStats { get; set; } = new List<CategoryStatsDto>();
    }

    public class QuizStatsDto
    {
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public DateTime CompletedAt { get; set; }
    }

    public class CategoryStatsDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int QuizzesTaken { get; set; }
    }
}
