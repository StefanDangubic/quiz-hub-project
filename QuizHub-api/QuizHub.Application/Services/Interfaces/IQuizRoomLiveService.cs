using QuizHub.Application.Common;
using QuizHub.Application.DTOs.QuizRoom;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Interfaces
{
    public interface IQuizRoomLiveService
    {
        Task<Result<bool>> StartQuizAsync(int roomId, int userId);
        Task<Result<QuizRoomQuestionDto>> GetCurrentQuestionAsync(int roomId);
        Task<Result<QuizRoomAnswerResultDto>> SubmitAnswerAsync(int roomId, int userId, int questionId, int? selectedAnswerId, List<int>? selectedAnswerIds, string? textAnswer);
        Task<Result<List<QuizRoomLeaderboardEntryDto>>> GetLiveLeaderboardAsync(int roomId);
        Task<Result<bool>> MoveToNextQuestionAsync(int roomId);
        Task<Result<QuizRoomResultsDto>> EndQuizAsync(int roomId);

    }
}
