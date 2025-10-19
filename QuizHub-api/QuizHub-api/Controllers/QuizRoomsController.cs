using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.DTOs.QuizRoom;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Enums;
using QuizHub_api.Attributes;
using System.Security.Claims;

namespace QuizHub_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizRoomsController : ControllerBase
    {

        private readonly IQuizRoomService _quizRoomService;

        public QuizRoomsController(IQuizRoomService quizRoomService)
        {
            _quizRoomService = quizRoomService;
        }

        [HttpPost]
        [Authorize(UserRole.Admin)]
        public async Task<IActionResult> CreateRoom([FromBody] CreateQuizRoomDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _quizRoomService.CreateRoomAsync(dto, userId);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveRooms()
        {
            var result = await _quizRoomService.GetActiveRoomsAsync();
            return Ok(result.Data);
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingRooms()
        {
            var result = await _quizRoomService.GetUpcomingRoomsAsync();
            return Ok(result.Data);
        }

        [HttpGet("code/{roomCode}")]
        public async Task<IActionResult> GetRoomByCode(string roomCode)
        {
            var result = await _quizRoomService.GetRoomByCodeAsync(roomCode);

            if (!result.IsSuccess)
                return NotFound(new { message = result.Message });

            return Ok(result.Data);
        }


        [HttpPost("join")]
        [Authorize]
        public async Task<IActionResult> JoinRoom([FromBody] JoinRoomDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _quizRoomService.JoinRoomAsync(dto.RoomCode, userId);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message});

            return Ok(result.Data);
        }

        [HttpPost("{roomId}/leave")]
        [Authorize]
        public async Task<IActionResult> LeaveRoom(int roomId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _quizRoomService.LeaveRoomAsync(roomId, userId);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = "Left room successfully" });
        }

        [HttpDelete("{roomId}")]
        [Authorize(UserRole.Admin)]
        public async Task<IActionResult> DeleteRoom(int roomId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _quizRoomService.DeleteRoomAsync(roomId, userId);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = "Room deleted successfully" });
        }
    }
}
