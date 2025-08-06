using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Auth;
using QuizHub.Application.DTOs.User;
using QuizHub.Application.Services.Interfaces;

namespace QuizHub_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        /// <summary>
        /// User registration
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<UserDto>>> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<UserDto>.SuccessResponse(result.Data!, result.Message));
            }

            return BadRequest(ApiResponse<UserDto>.ErrorResponse(result.Message, result.Errors));
        }

        /// <summary>
        /// User login
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<TokenDto>>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<TokenDto>.SuccessResponse(result.Data!, result.Message));
            }

            return BadRequest(ApiResponse<TokenDto>.ErrorResponse(result.Message, result.Errors));
        }



    }
}
