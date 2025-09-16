using AutoMapper;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Leaderboard;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Interfaces;
using QuizHub.Infrastructure.Data.Repositories;
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
        private readonly IQuizRepository _quizRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public LeaderboardService(
            IQuizAttemptRepository quizAttemptRepository,
            IQuizRepository quizRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _quizAttemptRepository = quizAttemptRepository;
            _quizRepository = quizRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }
       



        public async Task<Result<List<LeaderboardEntryDto>>> GetGlobalLeaderboardAsync(int quizId, string? timePeriod = null, int count = 100)
        {
            try
            {
                DateTime? fromDate = null;
                DateTime? toDate = null;

            
                if (!string.IsNullOrEmpty(timePeriod))
                {
                    var now = DateTime.UtcNow;
                    switch (timePeriod.ToLower())
                    {
                        case "weekly":
                        case "nedeljni":
                            fromDate = now.AddDays(-7);
                            break;
                        case "monthly":
                        case "mesečni":
                            fromDate = now.AddDays(-30);
                            break;
                    }
                    toDate = now;
                }

                // Get leaderboard for specific quiz with time filtering
                var attempts = await _quizAttemptRepository.GetQuizRankingsAsync(quizId, fromDate, toDate);
                var leaderboardEntries = _mapper.Map<List<LeaderboardEntryDto>>(attempts);

                // Add rank to each entry
                for (int i = 0; i < leaderboardEntries.Count; i++)
                {
                    leaderboardEntries[i].Rank = i + 1;
                }

                return Result<List<LeaderboardEntryDto>>.Success(leaderboardEntries);
            }
            catch (Exception ex)
            {
                return Result<List<LeaderboardEntryDto>>.Failure($"Error retrieving global leaderboard: {ex.Message}");
            }
        }


        public async Task<Result<int>> GetUserPositionAsync(int userId, int quizId, string? timePeriod = null)
        {
            try
            {
                DateTime? fromDate = null;
                DateTime? toDate = null;

             
                if (!string.IsNullOrEmpty(timePeriod))
                {
                    var now = DateTime.UtcNow;
                    switch (timePeriod.ToLower())
                    {
                        case "weekly":
                        case "nedeljni":
                            fromDate = now.AddDays(-7);
                            break;
                        case "monthly":
                        case "mesečni":
                            fromDate = now.AddDays(-30);
                            break;
                    }
                    toDate = now;
                }

             
                var position = await _quizAttemptRepository.GetUserPositionInQuizAsync(userId, quizId, fromDate, toDate);

                return Result<int>.Success(position);
            }
            catch (Exception ex)
            {
                return Result<int>.Failure($"Error retrieving user position: {ex.Message}");
            }
        }

        public async Task<Result<List<QuizFilterDto>>> GetQuizzesForFilterAsync()
        {
            try
            {
                var quizzes = await _quizRepository.GetAllWithCategoryAsync();
                var quizFilters = quizzes.Select(q => new QuizFilterDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    CategoryName = q.Category.Name
                }).OrderBy(q => q.CategoryName).ThenBy(q => q.Title).ToList();

                return Result<List<QuizFilterDto>>.Success(quizFilters);
            }
            catch (Exception ex)
            {
                return Result<List<QuizFilterDto>>.Failure($"Error retrieving quizzes for filter: {ex.Message}");
            }
        }


     
        public async Task<Result<UserStatsDto>> GetUserStatsAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return Result<UserStatsDto>.Failure("User not found");
                }

                var userAttempts = await _quizAttemptRepository.GetUserAttemptsAsync(userId);

                var recentQuizzes = userAttempts
                    .GroupBy(a => a.QuizId) 
                    .Select(g => g.OrderByDescending(a => a.CompletedAt).First()) 
                    .OrderByDescending(a => a.CompletedAt) 
                    .Take(5) 
                    .Select(a => new QuizStatsDto
                    {
                        QuizId = a.QuizId,
                        QuizTitle = a.Quiz.Title,
                        Score = a.Score,
                        MaxScore = a.Quiz.Questions.Sum(q => q.Points),
                        Percentage = a.Percentage,
                        CompletedAt = a.CompletedAt
                    })
                    .ToList();

                var userStats = new UserStatsDto
                {
                    UserId = userId,
                    Username = user.Username,
                    TotalQuizzesTaken = userAttempts.Select(a => a.QuizId).Distinct().Count(),
                    RecentQuizzes = recentQuizzes,
                    CategoryStats = userAttempts
                        .GroupBy(a => new { a.Quiz.CategoryId, a.Quiz.Category.Name })
                        .Select(g => new CategoryStatsDto
                        {
                            CategoryId = g.Key.CategoryId,
                            CategoryName = g.Key.Name,
                            QuizzesTaken = g.Select(a => a.QuizId).Distinct().Count()
                        })
                        .OrderByDescending(cs => cs.QuizzesTaken)
                        .ToList()
                };

                return Result<UserStatsDto>.Success(userStats);
            }
            catch (Exception ex)
            {
                return Result<UserStatsDto>.Failure($"Error retrieving user stats: {ex.Message}");
            }
        }



    }
}
