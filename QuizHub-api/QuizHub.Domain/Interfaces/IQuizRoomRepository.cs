using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Interfaces
{
    public interface IQuizRoomRepository : IRepository<QuizRoom>
    {
        Task<QuizRoom?> GetByRoomCodeAsync(string roomCode);
        Task<IEnumerable<QuizRoom>> GetActiveRoomsAsync();
        Task<IEnumerable<QuizRoom>> GetUpcomingRoomsAsync();
        Task<QuizRoomParticipant?> GetParticipantAsync(int roomId, int userId);
        Task AddParticipantAsync(QuizRoomParticipant participant);
        Task UpdateParticipantAsync(QuizRoomParticipant participant);
        Task<IEnumerable<QuizRoomParticipant>> GetRoomParticipantsAsync(int roomId);
        Task<QuizRoom?> GetWithDetailsAsync(int id);
        Task AddAnswerAsync(QuizRoomAnswer answer);
    }

}
