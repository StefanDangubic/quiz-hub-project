using QuizHub.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class QuizRoomParticipant : BaseEntity
    {
        public int QuizRoomId { get; set; }
        public int UserId { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LeftAt { get; set; }

        public int Score { get; set; } = 0;
        public int CorrectAnswers { get; set; } = 0;
        public int TotalAnswers { get; set; } = 0;

        public bool IsConnected { get; set; } = true;
        public bool IsRoomCreator { get; set; } = false;

        [MaxLength(100)]
        public string? ConnectionId { get; set; }

        // Navigation properties
        public virtual QuizRoom QuizRoom { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<QuizRoomAnswer> Answers { get; set; } = new List<QuizRoomAnswer>();
    }
}
