using AutoMapper;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.QuizRoom;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Implementations
{
    public class QuizRoomService : IQuizRoomService
    {
        private readonly IQuizRoomRepository _roomRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public QuizRoomService(
            IQuizRoomRepository roomRepository,
            IQuizRepository quizRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _roomRepository = roomRepository;
            _quizRepository = quizRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<Result<QuizRoomDto>> CreateRoomAsync(CreateQuizRoomDto dto, int userId)
        {
            var quiz = await _quizRepository.GetByIdAsync(dto.QuizId);
            if (quiz == null)
                return Result<QuizRoomDto>.Failure("Quiz not found");

            dto.ScheduledStartTime = DateTime.SpecifyKind(dto.ScheduledStartTime, DateTimeKind.Utc);

            if (dto.ScheduledStartTime <= DateTime.UtcNow)
                return Result<QuizRoomDto>.Failure("Scheduled start time must be in the future");

            var roomCode = GenerateRoomCode();

            var room = new QuizRoom
            {
                Name = dto.Name,
             //   Description = dto.Description,
                RoomCode = roomCode,
                QuizId = dto.QuizId,
                CreatedBy = userId,
                ScheduledStartTime = dto.ScheduledStartTime,
              //  MaxParticipants = dto.MaxParticipants,
                Status = QuizRoomStatus.Waiting
            };

            await _roomRepository.AddAsync(room);

            var roomDto = _mapper.Map<QuizRoomDto>(room);
            roomDto.QuizTitle = quiz.Title;

            var creator = await _userRepository.GetByIdAsync(userId);
            roomDto.CreatorUsername = creator?.Username ?? "Unknown";

            return Result<QuizRoomDto>.Success(roomDto);
        }

        private string GenerateRoomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<Result<List<QuizRoomDto>>> GetActiveRoomsAsync()
        {
            var rooms = await _roomRepository.GetActiveRoomsAsync();
            var roomDtos = _mapper.Map<List<QuizRoomDto>>(rooms);
            return Result<List<QuizRoomDto>>.Success(roomDtos);
        }

        public async Task<Result<List<QuizRoomDto>>> GetUpcomingRoomsAsync()
        {
            var rooms = await _roomRepository.GetUpcomingRoomsAsync();
            var roomDtos = _mapper.Map<List<QuizRoomDto>>(rooms);
            return Result<List<QuizRoomDto>>.Success(roomDtos);
        }

        public async Task<Result<QuizRoomDetailsDto>> GetRoomByCodeAsync(string roomCode)
        {
            var room = await _roomRepository.GetByRoomCodeAsync(roomCode);
            if (room == null)
                return Result<QuizRoomDetailsDto>.Failure("Room not found");

            var roomDto = _mapper.Map<QuizRoomDetailsDto>(room);
            return Result<QuizRoomDetailsDto>.Success(roomDto);
        }


        public async Task<Result<QuizRoomParticipantDto>> JoinRoomAsync(string roomCode, int userId)
        {
            var room = await _roomRepository.GetByRoomCodeAsync(roomCode);
            if (room == null)
                return Result<QuizRoomParticipantDto>.Failure("Room not found");

            if (room.Status != QuizRoomStatus.Waiting)
                return Result<QuizRoomParticipantDto>.Failure("Room has already started or ended");

            //if (room.Participants.Count >= room.MaxParticipants)
            //    return Result<QuizRoomParticipantDto>.Failure("Room is full");

            //var existingParticipant = await _roomRepository.GetParticipantAsync(room.Id, userId);
            //if (existingParticipant != null)
            //    return Result<QuizRoomParticipantDto>.Failure("You are already in this room");
           

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return Result<QuizRoomParticipantDto>.Failure("User not found");

        
            var existingParticipant = await _roomRepository.GetParticipantAsync(room.Id, userId);
            if (existingParticipant != null)
            {
               
                existingParticipant.IsConnected = true;
                existingParticipant.LeftAt = null; 

                await _roomRepository.UpdateParticipantAsync(existingParticipant);

                var reconnectDto = _mapper.Map<QuizRoomParticipantDto>(existingParticipant);
                reconnectDto.Username = user.Username;
                reconnectDto.ProfileImage = user.ProfileImage;

                return Result<QuizRoomParticipantDto>.Success(reconnectDto);
            }

            var participant = new QuizRoomParticipant
            {
                QuizRoomId = room.Id,
                UserId = userId,
                JoinedAt = DateTime.UtcNow,
                IsConnected = true,
                IsRoomCreator = room.CreatedBy == userId
            };

            await _roomRepository.AddParticipantAsync(participant);

            var participantDto = _mapper.Map<QuizRoomParticipantDto>(participant);
            participantDto.Username = user.Username;
            participantDto.ProfileImage = user.ProfileImage;

            return Result<QuizRoomParticipantDto>.Success(participantDto);
        }


        public async Task<Result<bool>> LeaveRoomAsync(int roomId, int userId)
        {
            var participant = await _roomRepository.GetParticipantAsync(roomId, userId);
            if (participant == null)
                return Result<bool>.Failure("You are not in this room");

            participant.LeftAt = DateTime.UtcNow;
            participant.IsConnected = false;

            await _roomRepository.UpdateParticipantAsync(participant);

            return Result<bool>.Success(true);
        }


        public async Task<Result<bool>> DeleteRoomAsync(int roomId, int userId)
        {
            var room = await _roomRepository.GetByIdAsync(roomId);
            if (room == null)
                return Result<bool>.Failure("Room not found");

            if (room.CreatedBy != userId)
                return Result<bool>.Failure("Only the room creator can delete the room");

            await _roomRepository.DeleteAsync(room);

            return Result<bool>.Success(true);
        }

    }

}