using QuizHub.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class QuizAttempt : BaseEntity
    {
        public int UserId { get; set; }
        public int QuizId { get; set; }

        [Range(0, int.MaxValue)]
        public int Score { get; set; }

        [Range(1, int.MaxValue)]
        public int MaxScore { get; set; }

        [Range(0, int.MaxValue)]
        public int TimeSpent { get; set; } // in seconds

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Quiz Quiz { get; set; } = null!;
        public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();

        // Calculated properties
        public double Percentage => MaxScore > 0 ? (double)Score / MaxScore * 100 : 0;
    }
}
