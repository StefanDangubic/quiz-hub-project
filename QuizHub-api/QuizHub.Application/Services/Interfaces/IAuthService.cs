using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Auth;
using QuizHub.Application.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Result<TokenDto>> LoginAsync(LoginDto loginDto);
        Task<Result<UserDto>> RegisterAsync(RegisterDto registerDto);
        Task<Result<UserDto>> GetUserByIdAsync(int userId);
        Task<Result<UserDto>> UpdateUserAsync(int userId, UpdateUserDto updateUserDto);
        Task<Result> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
    }
}
