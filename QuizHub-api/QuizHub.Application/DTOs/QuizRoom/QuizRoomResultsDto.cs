using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class QuizRoomResultsDto
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public List<QuizRoomLeaderboardEntryDto> FinalLeaderboard { get; set; } = new();
        public int TotalParticipants { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
