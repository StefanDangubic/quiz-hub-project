using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Leaderboard;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Enums;
using QuizHub_api.Attributes;

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



        [HttpGet("global")]
        public async Task<ActionResult<ApiResponse<List<LeaderboardEntryDto>>>> GetGlobalLeaderboard(
            [FromQuery] int quizId,
            [FromQuery] string? timePeriod = null,
            [FromQuery] int count = 100)
        {
            if (quizId <= 0)
            {
                return BadRequest(ApiResponse<List<LeaderboardEntryDto>>.ErrorResponse("Quiz ID is required."));
            }

            var result = await _leaderboardService.GetGlobalLeaderboardAsync(quizId, timePeriod, count);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<List<LeaderboardEntryDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<List<LeaderboardEntryDto>>.ErrorResponse(result.Message, result.Errors));
        }


        [HttpGet("user/position")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<int>>> GetUserPosition(
            [FromQuery] int quizId, 
            [FromQuery] string? timePeriod = null)
        {
            if (quizId <= 0)
            {
                return BadRequest(ApiResponse<int>.ErrorResponse("Quiz ID is required."));
            }

            var currentUserId = GetCurrentUserId();
            var result = await _leaderboardService.GetUserPositionAsync(currentUserId, quizId, timePeriod);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<int>.SuccessResponse(result.Data));
            }

            return BadRequest(ApiResponse<int>.ErrorResponse(result.Message, result.Errors));
        }


        [HttpGet("quizzes")]
        public async Task<ActionResult<ApiResponse<List<QuizFilterDto>>>> GetQuizzesForFilter()
        {
            var result = await _leaderboardService.GetQuizzesForFilterAsync();

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<List<QuizFilterDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<List<QuizFilterDto>>.ErrorResponse(result.Message, result.Errors));
        }

       

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }
}
