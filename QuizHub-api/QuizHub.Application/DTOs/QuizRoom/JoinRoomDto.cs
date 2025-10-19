using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.QuizRoom
{
    public class JoinRoomDto
    {
        [Required]
        [MaxLength(50)]
        public string RoomCode { get; set; } = string.Empty;
    }
}
