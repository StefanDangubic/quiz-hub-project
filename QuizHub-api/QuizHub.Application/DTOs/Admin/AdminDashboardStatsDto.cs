using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.DTOs.Admin
{
    public class AdminDashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalQuizzes { get; set; }
        public int TotalCategories { get; set; }
        public int TotalAttempts { get; set; }
    }
}
