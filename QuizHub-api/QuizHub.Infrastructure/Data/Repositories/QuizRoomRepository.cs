using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Domain.Interfaces;
using QuizHub.Infrastructure.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Data.Repositories
{
    public class QuizRoomRepository : Repository<QuizRoom>, IQuizRoomRepository
    {
        public QuizRoomRepository(QuizHubDbContext context) : base(context)
        {
        }

        public async Task<QuizRoom?> GetByRoomCodeAsync(string roomCode)
        {
            return await _context.QuizRooms
                .Include(r => r.Quiz)
                    .ThenInclude(q => q.Questions)
                        .ThenInclude(q => q.Answers)
                .Include(r => r.Creator)
                .Include(r => r.Participants)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(r => r.RoomCode == roomCode);
        }

        public async Task<IEnumerable<QuizRoom>> GetActiveRoomsAsync()
        {
            return await _context.QuizRooms
                .Include(r => r.Quiz)
                .Include(r => r.Creator)
                .Include(r => r.Participants)
                .Where(r => r.IsActive && (r.Status == QuizRoomStatus.Waiting || r.Status == QuizRoomStatus.InProgress))
                .OrderBy(r => r.ScheduledStartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<QuizRoom>> GetUpcomingRoomsAsync()
        {
            return await _context.QuizRooms
                .Include(r => r.Quiz)
                .Include(r => r.Creator)
                .Include(r => r.Participants)
                .Where(r => r.IsActive && r.Status == QuizRoomStatus.Waiting && r.ScheduledStartTime > DateTime.UtcNow)
                .OrderBy(r => r.ScheduledStartTime)
                .ToListAsync();
        }

        public async Task<QuizRoomParticipant?> GetParticipantAsync(int roomId, int userId)
        {
            return await _context.QuizRoomParticipants
                .Include(p => p.User)
                .Include(p => p.Answers)
                .FirstOrDefaultAsync(p => p.QuizRoomId == roomId && p.UserId == userId);
        }

        public async Task AddParticipantAsync(QuizRoomParticipant participant)
        {

            var existing = await _context.QuizRoomParticipants
            .FirstOrDefaultAsync(p => p.QuizRoomId == participant.QuizRoomId && p.UserId == participant.UserId);

            if (existing != null)
            {
                existing.IsConnected = true;
                existing.LeftAt = null;
                await _context.SaveChangesAsync();
                return;
            }

            await _context.QuizRoomParticipants.AddAsync(participant);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateParticipantAsync(QuizRoomParticipant participant)
        {
            _context.QuizRoomParticipants.Update(participant);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<QuizRoomParticipant>> GetRoomParticipantsAsync(int roomId)
        {
            return await _context.QuizRoomParticipants
                .Include(p => p.User)
                  .Include(p => p.Answers) 
                .Where(p => p.QuizRoomId == roomId)
                .OrderByDescending(p => p.Score)
                .ThenBy(p => p.JoinedAt)
                .ToListAsync();
        }

        public async Task<QuizRoom?> GetWithDetailsAsync(int id)
        {
            return await _context.QuizRooms
                .Include(r => r.Quiz)
                    .ThenInclude(q => q.Questions)
                        .ThenInclude(q => q.Answers)
                .Include(r => r.Creator)
                .Include(r => r.Participants)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddAnswerAsync(QuizRoomAnswer answer)
        {
            await _context.QuizRoomAnswers.AddAsync(answer);
            await _context.SaveChangesAsync();
        }
    }
}