using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Leaderboard;
using QuizHub.Application.Services.Interfaces;

namespace QuizHub_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaderboardController : ControllerBase
    {

        private readonly ILeaderboardService _leaderboardService;

        public LeaderboardController(ILeaderboardService leaderboardService)
        {
            _leaderboardService = leaderboardService;
        }

        /// <summary>
        /// Get quiz-specific leaderboard
        /// </summary>
        [HttpGet("quiz/{quizId}")]
        public async Task<ActionResult<ApiResponse<List<LeaderboardEntryDto>>>> GetQuizLeaderboard(int quizId, [FromQuery] int limit = 50)
        {
            var result = await _leaderboardService.GetQuizLeaderboardAsync(quizId, limit);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<List<LeaderboardEntryDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<List<LeaderboardEntryDto>>.ErrorResponse(result.Message, result.Errors));
        }

        /// <summary>
        /// Get global leaderboard
        /// </summary>
        [HttpGet("global")]
        public async Task<ActionResult<ApiResponse<List<LeaderboardEntryDto>>>> GetGlobalLeaderboard([FromQuery] int limit = 50)
        {
            var result = await _leaderboardService.GetGlobalLeaderboardAsync(limit);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<List<LeaderboardEntryDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<List<LeaderboardEntryDto>>.ErrorResponse(result.Message, result.Errors));
        }

    }
}
