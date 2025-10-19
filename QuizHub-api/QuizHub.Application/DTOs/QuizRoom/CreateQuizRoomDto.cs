using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class CreateQuizRoomDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        //[MaxLength(1000)]
        //public string? Description { get; set; }

        [Required]
        public int QuizId { get; set; }

        [Required]
        public DateTime ScheduledStartTime { get; set; }

        [Range(2, 100)]
        public int MaxParticipants { get; set; } = 50;
    }
}
