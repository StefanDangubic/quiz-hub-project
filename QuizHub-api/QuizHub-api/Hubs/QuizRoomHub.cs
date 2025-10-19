using Microsoft.AspNetCore.SignalR;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Interfaces;
using System.Security.Claims;

namespace QuizHub_api.Hubs
{
    public class QuizRoomHub : Hub
    {
        private readonly IQuizRoomRepository _roomRepository;
        private readonly IQuizRoomLiveService _liveService;
        private readonly ILogger<QuizRoomHub> _logger;

        public QuizRoomHub(
            IQuizRoomRepository roomRepository,
            IQuizRoomLiveService liveService,
            ILogger<QuizRoomHub> logger)
        {
            _roomRepository = roomRepository;
            _liveService = liveService;
            _logger = logger;
        }





        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (userId > 0)
            {
                // Find and update participant connection status
                var rooms = await _roomRepository.GetActiveRoomsAsync();
                foreach (var room in rooms)
                {
                    var participant = await _roomRepository.GetParticipantAsync(room.Id, userId);
                    if (participant != null && participant.ConnectionId == Context.ConnectionId)
                    {
                        participant.IsConnected = false;
                        participant.ConnectionId = null;
                        await _roomRepository.UpdateParticipantAsync(participant);

                        await Clients.Group($"room_{room.Id}")
                            .SendAsync("ParticipantDisconnected", new { userId, username = participant.User?.Username });
                    }
                }
            }

            _logger.LogInformation($"Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(string roomCode)
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            var room = await _roomRepository.GetByRoomCodeAsync(roomCode);
            if (room == null)
            {
                await Clients.Caller.SendAsync("Error", "Room not found");
                return;
            }

            var participant = await _roomRepository.GetParticipantAsync(room.Id, userId);
            if (participant == null)
            {
                await Clients.Caller.SendAsync("Error", "You must join the room first via API");
                return;
            }

            // Update connection ID
            participant.ConnectionId = Context.ConnectionId;
            participant.IsConnected = true;
            await _roomRepository.UpdateParticipantAsync(participant);

            // Add to SignalR group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"room_{room.Id}");

            // Notify others
            await Clients.OthersInGroup($"room_{room.Id}")
                .SendAsync("ParticipantJoined", new
                {
                    userId = participant.UserId,
                    username = participant.User?.Username,
                    profileImage = participant.User?.ProfileImage,
                    isConnected = participant.IsConnected
                });

            // Send current room state to the joining user
            var participants = await _roomRepository.GetRoomParticipantsAsync(room.Id);
            await Clients.Caller.SendAsync("RoomState", new
            {
                room.Id,
                room.Name,
                room.Status,
                room.CurrentQuestionIndex,
                isRoomCreator = participant.IsRoomCreator,
                participants = participants.Select(p => new
                {
                    userId = p.UserId,
                    username = p.User?.Username,
                    profileImage = p.User?.ProfileImage,
                    score = p.Score,
                    isConnected = p.IsConnected,
                    isRoomCreator = p.IsRoomCreator
                })
            });

            _logger.LogInformation($"User {userId} joined room {roomCode}");
        }


        public async Task LeaveRoom(int roomId)
        {
            var userId = GetUserId();
            if (userId == 0) return;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"room_{roomId}");

            var participant = await _roomRepository.GetParticipantAsync(roomId, userId);
            if (participant != null)
            {
                participant.IsConnected = false;
                participant.ConnectionId = null;
                await _roomRepository.UpdateParticipantAsync(participant);

                await Clients.OthersInGroup($"room_{roomId}")
                    .SendAsync("ParticipantLeft", new { userId, username = participant.User?.Username });
            }

            _logger.LogInformation($"User {userId} left room {roomId}");
        }


        public async Task StartQuiz(int roomId)
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            var result = await _liveService.StartQuizAsync(roomId, userId);
            if (result.IsSuccess)
            {
                // Notify all participants that quiz is starting
                await Clients.Group($"room_{roomId}").SendAsync("QuizStarting", new
                {
                    message = "Quiz is starting in 3 seconds...",
                    countdown = 3
                });

                // Wait 3 seconds then send first question
                await Task.Delay(3000);

                var questionResult = await _liveService.GetCurrentQuestionAsync(roomId);
                if (questionResult.IsSuccess)
                {
                    await Clients.Group($"room_{roomId}").SendAsync("QuestionStarted", questionResult.Data);
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", result.Message);
            }
        }

     
        public async Task SubmitAnswer(int roomId, int questionId, int? selectedAnswerId, List<int>? selectedAnswerIds, string? textAnswer)
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            try
            {
                var result = await _liveService.SubmitAnswerAsync(
                    roomId, userId, questionId, selectedAnswerId, selectedAnswerIds, textAnswer);

                if (result.IsSuccess)
                {
                   
                    await Clients.Caller.SendAsync("AnswerResult", result.Data);

                   
                    var leaderboard = await _liveService.GetLiveLeaderboardAsync(roomId);
                    await Clients.Group($"room_{roomId}").SendAsync("LeaderboardUpdate", leaderboard.Data);

                    var room = await _roomRepository.GetWithDetailsAsync(roomId);
                    var participants = await _roomRepository.GetRoomParticipantsAsync(roomId);
                    var activeParticipants = participants.Where(p => !p.IsRoomCreator && p.IsConnected).ToList();
                    var answeredCount = activeParticipants.Count(p => p.Answers.Any(a => a.QuestionId == questionId));

                   
                    if (answeredCount == activeParticipants.Count && activeParticipants.Count > 0)
                    {
                        await ShowLeaderboardAndMoveNext(roomId);
                    }
                }
                else
                {
                    await Clients.Caller.SendAsync("Error", result.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error submitting answer for user {userId} in room {roomId}");
                await Clients.Caller.SendAsync("Error", "Failed to submit answer");
            }
        }


        private async Task ShowLeaderboardAndMoveNext(int roomId)
        {
            try
            {
                var leaderboard = await _liveService.GetLiveLeaderboardAsync(roomId);

                await Clients.Group($"room_{roomId}").SendAsync("ShowQuestionLeaderboard", leaderboard.Data);
             
                await Task.Delay(5000);

                var moveResult = await _liveService.MoveToNextQuestionAsync(roomId);

                if (moveResult.IsSuccess)
                {
                    var room = await _roomRepository.GetWithDetailsAsync(roomId);

                    if (room?.Status == QuizHub.Domain.Enums.QuizRoomStatus.Completed)
                    {
                       
                        var finalResults = await _liveService.GetLiveLeaderboardAsync(roomId);
                        await Clients.Group($"room_{roomId}").SendAsync("QuizCompleted", new
                        {
                            finalLeaderboard = finalResults.Data,
                            message = "Quiz completed! Here are the final results."
                        });
                    }
                    else
                    {
                       
                        var questionResult = await _liveService.GetCurrentQuestionAsync(roomId);
                        if (questionResult.IsSuccess)
                        {
                            await Clients.Group($"room_{roomId}").SendAsync("QuestionStarted", questionResult.Data);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in ShowLeaderboardAndMoveNext for room {roomId}");
            }
        }



        private int GetUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }



    }

}