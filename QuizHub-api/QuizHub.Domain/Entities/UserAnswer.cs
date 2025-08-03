using QuizHub.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class UserAnswer : BaseEntity
    {
        public int QuizAttemptId { get; set; }
        public int QuestionId { get; set; }
        public int? AnswerId { get; set; } // null for fill-in-the-blank questions

        [MaxLength(500)]
        public string? UserInput { get; set; } // for fill-in-the-blank questions

        public bool IsCorrect { get; set; }

        // Navigation properties
        public virtual QuizAttempt QuizAttempt { get; set; } = null!;
        public virtual Question Question { get; set; } = null!;
        public virtual Answer? Answer { get; set; }
    }
}
