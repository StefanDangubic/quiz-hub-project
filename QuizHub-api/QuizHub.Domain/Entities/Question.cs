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
    public class Question : BaseEntity
    {
        public int QuizId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string QuestionText { get; set; } = string.Empty;

        public QuestionType QuestionType { get; set; }

        [Range(1, 10)]
        public int Points { get; set; } = 1;

        public int OrderIndex { get; set; }

        // Navigation properties
        public virtual Quiz Quiz { get; set; } = null!;
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
    }
}
