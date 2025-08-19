using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Leaderboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Interfaces
{
    public interface ILeaderboardService
    {
        Task<Result<List<LeaderboardEntryDto>>> GetGlobalLeaderboardAsync(int count = 100);
        Task<Result<List<LeaderboardEntryDto>>> GetQuizLeaderboardAsync(int quizId, int count = 10);
        Task<Result<List<LeaderboardEntryDto>>> GetCategoryLeaderboardAsync(int categoryId, int count = 100);
      //  Task<Result<UserStatsDto>> GetUserStatsAsync(int userId);
    }
}
