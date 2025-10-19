using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class QuizRoomAnswerResultDto
    {
        public bool IsCorrect { get; set; }
        public int PointsEarned { get; set; }
        public int SpeedBonus { get; set; }
        public int TimeToAnswerMs { get; set; }
        public int TotalScore { get; set; }
        public int? CorrectAnswerId { get; set; }
        public List<int>? CorrectAnswerIds { get; set; }
    }
}
