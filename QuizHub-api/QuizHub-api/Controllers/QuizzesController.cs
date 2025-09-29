using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Quiz;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Enums;
using QuizHub_api.Attributes;

namespace QuizHub_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizzesController : ControllerBase
    {

        private readonly IQuizService _quizService;

        public QuizzesController(IQuizService quizService)
        {
            _quizService = quizService;
        }




        /// <summary>
        /// Get all quizzes with filtering and pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResult<QuizDto>>>> GetQuizzes(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] DifficultyLevel? difficulty = null)
        {
            var result = await _quizService.GetQuizzesAsync(page, pageSize, searchTerm, categoryId, difficulty);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<PaginatedResult<QuizDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<PaginatedResult<QuizDto>>.ErrorResponse(result.Message, result.Errors));
        }




        /// <summary>
        /// Get quiz by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<QuizDto>>> GetQuiz(int id)
        {
            var result = await _quizService.GetQuizByIdAsync(id);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<QuizDto>.SuccessResponse(result.Data!));
            }

            return NotFound(ApiResponse<QuizDto>.ErrorResponse(result.Message));
        }

        /// <summary>
        /// Create new quiz (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(UserRole.Admin)]
        public async Task<ActionResult<ApiResponse<QuizDto>>> CreateQuiz([FromBody] CreateQuizDto createQuizDto)
        {
         

            var userId = GetCurrentUserId();
            var result = await _quizService.CreateQuizAsync(createQuizDto, userId);

            if (result.IsSuccess)
            {
                return CreatedAtAction(nameof(GetQuiz), new { id = result.Data!.Id },
                    ApiResponse<QuizDto>.SuccessResponse(result.Data, result.Message));
            }

            return BadRequest(ApiResponse<QuizDto>.ErrorResponse(result.Message, result.Errors));
        }

        [HttpGet("{id}/with-questions")]
        public async Task<ActionResult<ApiResponse<QuizWithQuestionsDto>>> GetQuizWithQuestions(int id)
        {
            var result = await _quizService.GetQuizWithQuestionsAsync(id);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<QuizWithQuestionsDto>.SuccessResponse(result.Data!, result.Message));
            }

            return NotFound(ApiResponse<QuizWithQuestionsDto>.ErrorResponse(result.Message, result.Errors));
        }

        [HttpPut("{id}")]
        [Authorize(UserRole.Admin)]
        public async Task<ActionResult<ApiResponse<QuizDto>>> UpdateQuiz(int id, [FromBody] UpdateQuizDto updateQuizDto)
        {
           

            var userId = GetCurrentUserId();
            var result = await _quizService.UpdateQuizAsync(id, updateQuizDto, userId);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<QuizDto>.SuccessResponse(result.Data!, result.Message));
            }

            return BadRequest(ApiResponse<QuizDto>.ErrorResponse(result.Message, result.Errors));
        }


        /// <summary>
        /// Delete quiz (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(UserRole.Admin)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteQuiz(int id)
        {
           
            var result = await _quizService.DeleteQuizAsync(id);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<object>.SuccessResponse(null, result.Message));
            }

            return BadRequest(ApiResponse<object>.ErrorResponse(result.Message, result.Errors));
        }

        [HttpPost("{id}/submit")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<QuizResultDto>>> SubmitQuiz(int id, [FromBody] SubmitQuizDto submitQuizDto)
        {
            if (id != submitQuizDto.QuizId)
            {
                return BadRequest(ApiResponse<QuizResultDto>.ErrorResponse("Quiz ID mismatch"));
            }

           

            var userId = GetCurrentUserId();
            var result = await _quizService.SubmitQuizAsync(submitQuizDto, userId);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<QuizResultDto>.SuccessResponse(result.Data!, result.Message));
            }

            return BadRequest(ApiResponse<QuizResultDto>.ErrorResponse(result.Message, result.Errors));
        }


        [HttpGet("attempts/{attemptId}/result")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<QuizResultDto>>> GetQuizResult(int attemptId)
        {
            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            var result = await _quizService.GetQuizResultAsync(attemptId, userId, isAdmin);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<QuizResultDto>.SuccessResponse(result.Data!));
            }

            return NotFound(ApiResponse<QuizResultDto>.ErrorResponse(result.Message));
        }

        [HttpGet("my-history")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<UserQuizHistoryDto>>>> GetMyHistory([FromQuery] int? quizId = null)
        {
            var userId = GetCurrentUserId();
            var result = await _quizService.GetUserQuizHistoryAsync(userId, quizId);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<List<UserQuizHistoryDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<List<UserQuizHistoryDto>>.ErrorResponse(result.Message, result.Errors));
        }

        [HttpGet("{quizId}/my-progress")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<QuizProgressDto>>> GetMyProgress(int quizId)
        {
            var userId = GetCurrentUserId();
          
            var result = await _quizService.GetQuizProgressAsync(userId, quizId);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<QuizProgressDto>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<QuizProgressDto>.ErrorResponse(result.Message, result.Errors));
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            return int.Parse(userIdClaim ?? "0");
        }




    }
}
