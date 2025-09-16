using QuizHub.Application.DTOs.Admin;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IQuizAttemptRepository _quizAttemptRepository;

        public AdminService(
            IUserRepository userRepository,
            IQuizRepository quizRepository,
            ICategoryRepository categoryRepository,
            IQuizAttemptRepository quizAttemptRepository)
        {
            _userRepository = userRepository;
            _quizRepository = quizRepository;
            _categoryRepository = categoryRepository;
            _quizAttemptRepository = quizAttemptRepository;
        }

        public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalUsers = await _userRepository.CountAsync();
            var totalQuizzes = await _quizRepository.CountAsync();
            var totalCategories = await _categoryRepository.CountAsync();
            var totalAttempts = await _quizAttemptRepository.CountAsync();

            return new AdminDashboardStatsDto
            {
                TotalUsers = totalUsers - 1,
                TotalQuizzes = totalQuizzes,
                TotalCategories = totalCategories,
                TotalAttempts = totalAttempts
            };
        }
    }
}
