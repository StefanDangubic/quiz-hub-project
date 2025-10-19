using QuizHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class QuizRoomDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
      //  public string? Description { get; set; }
        public string RoomCode { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public string CreatorUsername { get; set; } = string.Empty;
        public DateTime ScheduledStartTime { get; set; }
        public DateTime? ActualStartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public QuizRoomStatus Status { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public int CurrentQuestionIndex { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
