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
        public int TotalScore { get; set; }
        public double AverageScore { get; set; }
        public int BestScore { get; set; }
        public List<CategoryStatsDto> CategoryStats { get; set; } = new List<CategoryStatsDto>();
    }

    public class CategoryStatsDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int QuizzesTaken { get; set; }
        public double AverageScore { get; set; }
        public int BestScore { get; set; }
    }
}
