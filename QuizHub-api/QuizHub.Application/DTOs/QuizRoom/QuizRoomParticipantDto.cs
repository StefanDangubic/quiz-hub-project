using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class QuizRoomParticipantDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
        public DateTime JoinedAt { get; set; }
        public int Score { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalAnswers { get; set; }
        public bool IsConnected { get; set; }
    }
}
