using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Quiz
{
    public class QuizProgressDto
    {
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public List<AttemptProgressDto> Attempts { get; set; } = new();
        public double BestScore { get; set; }
        public double AverageScore { get; set; }
        public int TotalAttempts { get; set; }
    }

    public class AttemptProgressDto
    {
        public int AttemptNumber { get; set; }
        public double Score { get; set; }
        public int TimeSpent { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
