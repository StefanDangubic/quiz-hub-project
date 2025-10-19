using QuizHub.Application.Common;
using QuizHub.Application.DTOs.QuizRoom;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Interfaces
{
    public interface IQuizRoomService
    {
        Task<Result<QuizRoomDto>> CreateRoomAsync(CreateQuizRoomDto dto, int userId);
        Task<Result<List<QuizRoomDto>>> GetActiveRoomsAsync();
        Task<Result<List<QuizRoomDto>>> GetUpcomingRoomsAsync();
        Task<Result<QuizRoomDetailsDto>> GetRoomByCodeAsync(string roomCode);
        Task<Result<QuizRoomParticipantDto>> JoinRoomAsync(string roomCode, int userId);

        Task<Result<bool>> LeaveRoomAsync(int roomId, int userId);

        Task<Result<bool>> DeleteRoomAsync(int roomId, int userId);
    }
}
