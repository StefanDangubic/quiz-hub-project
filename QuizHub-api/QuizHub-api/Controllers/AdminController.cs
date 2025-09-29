using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Enums;
using QuizHub_api.Attributes;

namespace QuizHub_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
  
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard-stats")]
        [Authorize(UserRole.Admin)]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _adminService.GetDashboardStatsAsync();
                return Ok(new { success = true, data = stats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("quiz-attempts")]
        [Authorize(UserRole.Admin)]
        public async Task<IActionResult> GetAllQuizAttempts()
        {
            try
            {
                var attempts = await _adminService.GetAllQuizAttemptsAsync();
                return Ok(new { success = true, data = attempts });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
