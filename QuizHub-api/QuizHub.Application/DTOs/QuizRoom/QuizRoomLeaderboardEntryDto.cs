using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class QuizRoomLeaderboardEntryDto
    {
        public int Rank { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
        public int Score { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalAnswers { get; set; }
        public int TotalTimeMs { get; set; }
    }
}
