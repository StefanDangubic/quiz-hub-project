using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Leaderboard
{
    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public int TimeSpent { get; set; }
        public DateTime CompletedAt { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
    }
}
