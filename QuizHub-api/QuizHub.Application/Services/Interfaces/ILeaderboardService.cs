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
       
        Task<Result<List<LeaderboardEntryDto>>> GetGlobalLeaderboardAsync(int quizId, string? timePeriod = null, int count = 100);
       
        Task<Result<int>> GetUserPositionAsync(int userId, int quizId, string? timePeriod = null);
        Task<Result<List<QuizFilterDto>>> GetQuizzesForFilterAsync();

    }
}
