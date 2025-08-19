using AutoMapper;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Leaderboard;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Implementations
{
    public class LeaderboardService : ILeaderboardService
    {
        private readonly IQuizAttemptRepository _quizAttemptRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public LeaderboardService(
            IQuizAttemptRepository quizAttemptRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _quizAttemptRepository = quizAttemptRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public Task<Result<List<LeaderboardEntryDto>>> GetCategoryLeaderboardAsync(int categoryId, int count = 100)
        {
            throw new NotImplementedException();
        }

        public Task<Result<List<LeaderboardEntryDto>>> GetGlobalLeaderboardAsync(int count = 100)
        {
            throw new NotImplementedException();
        }

        //public async Task<Result<List<LeaderboardEntryDto>>> GetGlobalLeaderboardAsync(int limit = 50)
        //{
        //    try
        //    {
        //        var topUsers = await _quizAttemptRepository.GetTopUsersAsync(limit);
        //        var leaderboard = topUsers.Select((user, index) => new LeaderboardEntryDto
        //        {
        //            Rank = index + 1,
        //            UserId = user.UserId,
        //            Username = user.User.Username,
        //            ProfileImageUrl = user.User.ProfileImageUrl,
        //            TotalScore = user.TotalScore,
        //            QuizzesCompleted = user.QuizzesCompleted,
        //            AverageScore = user.AverageScore
        //        }).ToList();

        //        return Result<List<LeaderboardEntryDto>>.Success(leaderboard);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Result<List<LeaderboardEntryDto>>.Failure($"Error retrieving global leaderboard: {ex.Message}");
        //    }
        //}

        public Task<Result<List<LeaderboardEntryDto>>> GetQuizLeaderboardAsync(int quizId, int count = 10)
        {
            throw new NotImplementedException();
        }
    }
}
