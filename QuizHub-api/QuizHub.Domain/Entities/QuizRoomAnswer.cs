using QuizHub.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class QuizRoomAnswer : BaseEntity
    {
        public int QuizRoomParticipantId { get; set; }
        public int QuestionId { get; set; }
        public int? SelectedAnswerId { get; set; }
        public string? SelectedAnswerIds { get; set; }
        public string? TextAnswer { get; set; }

        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
        public int TimeToAnswerMs { get; set; } 

        public bool IsCorrect { get; set; }
        public int PointsEarned { get; set; }

        // Navigation properties
        public virtual QuizRoomParticipant Participant { get; set; } = null!;
        public virtual Question Question { get; set; } = null!;
        public virtual Answer? SelectedAnswer { get; set; }
    }
}
