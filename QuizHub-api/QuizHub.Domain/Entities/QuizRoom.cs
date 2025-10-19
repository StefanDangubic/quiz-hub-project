using QuizHub.Domain.Common;
using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class QuizRoom : BaseEntity, IAuditableEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoomCode { get; set; } = string.Empty;

        public int QuizId { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        public DateTime ScheduledStartTime { get; set; }
        public DateTime? ActualStartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public QuizRoomStatus Status { get; set; } = QuizRoomStatus.Waiting;

        public int MaxParticipants { get; set; } = 50;
        public int CurrentQuestionIndex { get; set; } = 0;
        public DateTime? CurrentQuestionStartTime { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Quiz Quiz { get; set; } = null!;
        public virtual User Creator { get; set; } = null!;
        public virtual ICollection<QuizRoomParticipant> Participants { get; set; } = new List<QuizRoomParticipant>();
    }
}
