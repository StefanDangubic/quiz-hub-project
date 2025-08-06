using AutoMapper;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Auth;
using QuizHub.Application.DTOs.User;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Domain.Interfaces;
using QuizHub.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHashService _passwordHashService;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IMapper _mapper;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHashService passwordHashService,
            IJwtTokenService jwtTokenService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _passwordHashService = passwordHashService;
            _jwtTokenService = jwtTokenService;
            _mapper = mapper;
        }

        public async Task<Result<TokenDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // Find user by username or email
                User? user = null;

                if (loginDto.UsernameOrEmail.Contains("@"))
                {
                    user = await _userRepository.GetByEmailAsync(loginDto.UsernameOrEmail);
                }
                else
                {
                    user = await _userRepository.GetByUsernameAsync(loginDto.UsernameOrEmail);
                }

                if (user == null)
                {
                    return Result<TokenDto>.Failure("Invalid username/email");
                }

                if (!user.IsActive)
                {
                    return Result<TokenDto>.Failure("Account is deactivated");
                }

                // Verify password
                if (!_passwordHashService.VerifyPassword(loginDto.Password, user.PasswordHash))
                {
                    return Result<TokenDto>.Failure("Invalid password");
                }

                // Generate token
                var token = _jwtTokenService.GenerateToken(user);
                var userDto = _mapper.Map<UserDto>(user);

                var tokenDto = new TokenDto
                {
                    AccessToken = token,
                    TokenType = "Bearer",
                    ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                    User = userDto
                };

                return Result<TokenDto>.Success(tokenDto, "Login successful");
            }
            catch (Exception ex)
            {
                return Result<TokenDto>.Failure($"Login failed: {ex.Message}");
            }
        }





        public async Task<Result<UserDto>> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Provera jedinstvenosti korisničkog imena
                if (!await _userRepository.IsUsernameUniqueAsync(registerDto.Username))
                {
                    return Result<UserDto>.Failure("Username already exists");
                }

                // Check if email is unique
                if (!await _userRepository.IsEmailUniqueAsync(registerDto.Email))
                {
                    return Result<UserDto>.Failure("Email already exists");
                }

                // Kreiraj novog korisnika iz DTO
                var user = _mapper.Map<User>(registerDto);
                user.PasswordHash = _passwordHashService.HashPassword(registerDto.Password);
                user.Role = UserRole.User;
                user.IsActive = true;

                user = await _userRepository.AddAsync(user);

                // Mapiraj entitet korisnika u UserDto koji vraćaš
                var userDto = _mapper.Map<UserDto>(user);

                return Result<UserDto>.Success(userDto, "Registration successful");
            }
            catch (Exception ex)
            {
                return Result<UserDto>.Failure($"Registration failed: {ex.Message}");
            }
        }

        public async Task<Result<UserDto>> GetUserByIdAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return Result<UserDto>.Failure("User not found");
                }

                var userDto = _mapper.Map<UserDto>(user);
                return Result<UserDto>.Success(userDto);
            }
            catch (Exception ex)
            {
                return Result<UserDto>.Failure($"Error retrieving user: {ex.Message}");
            }
        }

        public async Task<Result<UserDto>> UpdateUserAsync(int userId, UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return Result<UserDto>.Failure("User not found");
                }

                // Update fields if provided
                if (!string.IsNullOrWhiteSpace(updateUserDto.Username))
                {
                    if (!await _userRepository.IsUsernameUniqueAsync(updateUserDto.Username, userId))
                    {
                        return Result<UserDto>.Failure("Username already exists");
                    }
                    user.Username = updateUserDto.Username;
                }

                if (!string.IsNullOrWhiteSpace(updateUserDto.Email))
                {
                    if (!await _userRepository.IsEmailUniqueAsync(updateUserDto.Email, userId))
                    {
                        return Result<UserDto>.Failure("Email already exists");
                    }
                    user.Email = updateUserDto.Email;
                }

                if (updateUserDto.ProfileImage != null)
                {
                    user.ProfileImage = updateUserDto.ProfileImage;
                }

                await _userRepository.UpdateAsync(user);

                var userDto = _mapper.Map<UserDto>(user);
                return Result<UserDto>.Success(userDto, "User updated successfully");
            }
            catch (Exception ex)
            {
                return Result<UserDto>.Failure($"Error updating user: {ex.Message}");
            }
        }

        public async Task<Result> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return Result.Failure("User not found");
                }

                // Verify current password
                if (!_passwordHashService.VerifyPassword(changePasswordDto.CurrentPassword, user.PasswordHash))
                {
                    return Result.Failure("Current password is incorrect");
                }

                // Update password
                user.PasswordHash = _passwordHashService.HashPassword(changePasswordDto.NewPassword);
                await _userRepository.UpdateAsync(user);

                return Result.Success("Password changed successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error changing password: {ex.Message}");
            }
        }
    }
}
