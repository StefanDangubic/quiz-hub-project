using AutoMapper;
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
        private readonly IMapper _mapper;

        public AdminService(
            IUserRepository userRepository,
            IQuizRepository quizRepository,
            ICategoryRepository categoryRepository,
            IQuizAttemptRepository quizAttemptRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _quizRepository = quizRepository;
            _categoryRepository = categoryRepository;
            _quizAttemptRepository = quizAttemptRepository;
            _mapper = mapper;
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

        public async Task<IEnumerable<AdminQuizAttemptDto>> GetAllQuizAttemptsAsync()
        {
            var attempts = await _quizAttemptRepository.GetAllAttemptsForAdminAsync();
            return _mapper.Map<IEnumerable<AdminQuizAttemptDto>>(attempts.OrderByDescending(a => a.CompletedAt));
        }
    }
}
