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
    public class Quiz : BaseEntity, IAuditableEntity
    {
         [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public int CategoryId { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }

        [Range(1, 300)]
        public int TimeLimit { get; set; } // in minutes

       public bool IsActive { get; set; } = true;

        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; } = null!;
        public virtual User Creator { get; set; } = null!;
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public virtual ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
    }
}
