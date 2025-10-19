using AutoMapper;
using Microsoft.Extensions.Logging;
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
    public class QuizRoomLiveService : IQuizRoomLiveService
    {
        private readonly IQuizRoomRepository _roomRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<QuizRoomLiveService> _logger;

       
        private const int MaxSpeedBonus = 6; 
        private const int MinSpeedBonus = 0;  

        public QuizRoomLiveService(
            IQuizRoomRepository roomRepository,
            IQuizRepository quizRepository,
            IMapper mapper,
            ILogger<QuizRoomLiveService> logger)
        {
            _roomRepository = roomRepository;
            _quizRepository = quizRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<bool>> StartQuizAsync(int roomId, int userId)
        {
            var room = await _roomRepository.GetWithDetailsAsync(roomId);
            if (room == null)
                return Result<bool>.Failure("Room not found");

            if (room.CreatedBy != userId)
                return Result<bool>.Failure("Only the room creator can start the quiz");

            if (room.Status != QuizRoomStatus.Waiting)
                return Result<bool>.Failure("Quiz has already started or ended");

            //var participants = await _roomRepository.GetRoomParticipantsAsync(roomId);
            //if (participants.Count() < 2)
            //    return Result<bool>.Failure("At least 2 participants required to start");

            room.Status = QuizRoomStatus.InProgress;
            room.ActualStartTime = DateTime.UtcNow;
            room.CurrentQuestionIndex = 0;
            //room.CurrentQuestionStartTime = DateTime.UtcNow;

            await _roomRepository.UpdateAsync(room);

            _logger.LogInformation($"Quiz started in room {roomId} by user {userId}");
            return Result<bool>.Success(true);
        }

        public async Task<Result<QuizRoomQuestionDto>> GetCurrentQuestionAsync(int roomId)
        {
            var room = await _roomRepository.GetWithDetailsAsync(roomId);
            if (room == null)
                return Result<QuizRoomQuestionDto>.Failure("Room not found");

            if (room.Status != QuizRoomStatus.InProgress)
                return Result<QuizRoomQuestionDto>.Failure("Quiz is not in progress");

            var quiz = await _quizRepository.GetQuizWithQuestionsAsync(room.QuizId);
            if (quiz == null)
                return Result<QuizRoomQuestionDto>.Failure("Quiz not found");

            var questions = quiz.Questions.OrderBy(q => q.OrderIndex).ToList();
            if (room.CurrentQuestionIndex >= questions.Count)
                return Result<QuizRoomQuestionDto>.Failure("No more questions");

            var currentQuestion = questions[room.CurrentQuestionIndex];
            //

            room.CurrentQuestionStartTime = DateTime.UtcNow;

            await _roomRepository.UpdateAsync(room);
            //
            var questionDto = new QuizRoomQuestionDto
            {
                QuestionId = currentQuestion.Id,
                QuestionText = currentQuestion.QuestionText,
                QuestionType = currentQuestion.QuestionType,
                Points = currentQuestion.Points,
                QuestionNumber = room.CurrentQuestionIndex + 1,
                TotalQuestions = questions.Count,
                TimeLimit = 30, // 30 seconds per question
                Answers = currentQuestion.Answers.Select(a => new QuizRoomAnswerOptionDto
                {
                    AnswerId = a.Id,
                    AnswerText = a.AnswerText
                }).ToList()
            };

            return Result<QuizRoomQuestionDto>.Success(questionDto);
        }



        public async Task<Result<QuizRoomAnswerResultDto>> SubmitAnswerAsync(
           int roomId, int userId, int questionId, int? selectedAnswerId, List<int>? selectedAnswerIds, string? textAnswer)
        {
            var room = await _roomRepository.GetWithDetailsAsync(roomId);
            if (room == null)
                return Result<QuizRoomAnswerResultDto>.Failure("Room not found");

            if (room.Status != QuizRoomStatus.InProgress)
                return Result<QuizRoomAnswerResultDto>.Failure("Quiz is not in progress");

            var participant = await _roomRepository.GetParticipantAsync(roomId, userId);
            if (participant == null)
                return Result<QuizRoomAnswerResultDto>.Failure("Participant not found");

            // Check if already answered this question
            if (participant.Answers.Any(a => a.QuestionId == questionId))
                return Result<QuizRoomAnswerResultDto>.Failure("Already answered this question");

            var quiz = await _quizRepository.GetQuizWithQuestionsAsync(room.QuizId);
            var question = quiz?.Questions.FirstOrDefault(q => q.Id == questionId);
            if (question == null)
                return Result<QuizRoomAnswerResultDto>.Failure("Question not found");

  
            var timeToAnswer = (int)(DateTime.UtcNow - room.CurrentQuestionStartTime!.Value).TotalMilliseconds;

            bool isCorrect = false;
            int? correctAnswerId = null;
            List<int>? correctAnswerIds = null;

            switch (question.QuestionType)
            {
                case QuestionType.SingleChoice:
                case QuestionType.TrueFalse:
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                    correctAnswerId = correctAnswer?.Id;
                    isCorrect = correctAnswer != null && correctAnswer.Id == selectedAnswerId;
                    break;

                case QuestionType.MultipleChoice:
                    correctAnswerIds = question.Answers.Where(a => a.IsCorrect).Select(a => a.Id).OrderBy(id => id).ToList();
                    var userAnswers = (selectedAnswerIds ?? new List<int>()).OrderBy(id => id).ToList();
                    isCorrect = correctAnswerIds.Count > 0 && correctAnswerIds.SequenceEqual(userAnswers);
                    break;

                case QuestionType.FillInTheBlank:
                    var correctTextAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                    isCorrect = correctTextAnswer != null &&
                        string.Equals(correctTextAnswer.AnswerText?.Trim(), textAnswer?.Trim(), StringComparison.OrdinalIgnoreCase);
                    break;
            }

          
            int pointsEarned = 0;
            int speedBonus = 0;
            if (isCorrect)
            {
                pointsEarned = question.Points; 

                
                speedBonus = CalculateSpeedBonus(timeToAnswer, 30000);
                pointsEarned += speedBonus;
            }

            
            var answer = new QuizRoomAnswer
            {
                QuizRoomParticipantId = participant.Id,
                QuestionId = questionId,
                SelectedAnswerId = selectedAnswerId,
                SelectedAnswerIds = selectedAnswerIds != null && selectedAnswerIds.Any()
                    ? string.Join(",", selectedAnswerIds)
                    : null,
                TextAnswer = textAnswer,
                AnsweredAt = DateTime.UtcNow,
                TimeToAnswerMs = timeToAnswer,
                IsCorrect = isCorrect,
                PointsEarned = pointsEarned
            };

            await _roomRepository.AddAnswerAsync(answer);

          
            participant.TotalAnswers++;
            if (isCorrect)
            {
                participant.CorrectAnswers++;
                participant.Score += pointsEarned;
            }
            await _roomRepository.UpdateParticipantAsync(participant);

            var result = new QuizRoomAnswerResultDto
            {
                IsCorrect = isCorrect,
                PointsEarned = pointsEarned,
                SpeedBonus = speedBonus,
                TimeToAnswerMs = timeToAnswer,
                TotalScore = participant.Score,
                CorrectAnswerId = correctAnswerId,
                CorrectAnswerIds = correctAnswerIds
            };

            _logger.LogInformation($"User {userId} answered question {questionId} in room {roomId}: {(isCorrect ? "Correct" : "Incorrect")} ({pointsEarned} points)");

            return Result<QuizRoomAnswerResultDto>.Success(result);
        }

        

        public async Task<Result<List<QuizRoomLeaderboardEntryDto>>> GetLiveLeaderboardAsync(int roomId)
        {
            var participants = await _roomRepository.GetRoomParticipantsAsync(roomId);

            var leaderboard = participants
                .Where(p => !p.IsRoomCreator)
                .OrderByDescending(p => p.Score)
                .ThenBy(p => p.Answers.Sum(a => a.TimeToAnswerMs))
                .Select((p, index) => new QuizRoomLeaderboardEntryDto
                {
                    Rank = index + 1,
                    UserId = p.UserId,
                    Username = p.User?.Username ?? "Unknown",
                    ProfileImage = p.User?.ProfileImage,
                    Score = p.Score,
                    CorrectAnswers = p.CorrectAnswers,
                    TotalAnswers = p.TotalAnswers,
                    TotalTimeMs = p.Answers.Sum(a => a.TimeToAnswerMs)
                })
                .ToList();

            return Result<List<QuizRoomLeaderboardEntryDto>>.Success(leaderboard);
        }


        public async Task<Result<bool>> MoveToNextQuestionAsync(int roomId)
        {
            var room = await _roomRepository.GetWithDetailsAsync(roomId);
            if (room == null)
                return Result<bool>.Failure("Room not found");

            var quiz = await _quizRepository.GetQuizWithQuestionsAsync(room.QuizId);
            if (quiz == null)
                return Result<bool>.Failure("Quiz not found");

            var totalQuestions = quiz.Questions.Count;

            if (room.CurrentQuestionIndex >= totalQuestions - 1)
            {
               
                await EndQuizAsync(roomId);
                return Result<bool>.Success(false);

            }

            room.CurrentQuestionIndex++;
            room.CurrentQuestionStartTime = DateTime.UtcNow;
            await _roomRepository.UpdateAsync(room);

            return Result<bool>.Success(true);
        }

        public async Task<Result<QuizRoomResultsDto>> EndQuizAsync(int roomId)
        {
            var room = await _roomRepository.GetWithDetailsAsync(roomId);
            if (room == null)
                return Result<QuizRoomResultsDto>.Failure("Room not found");

            room.Status = QuizRoomStatus.Completed;
            room.EndTime = DateTime.UtcNow;
            await _roomRepository.UpdateAsync(room);

            var leaderboardResult = await GetLiveLeaderboardAsync(roomId);

            var results = new QuizRoomResultsDto
            {
                RoomId = roomId,
                RoomName = room.Name,
                FinalLeaderboard = leaderboardResult.Data ?? new List<QuizRoomLeaderboardEntryDto>(),
                TotalParticipants = room.Participants.Count,
                Duration = room.EndTime.Value - room.ActualStartTime!.Value
            };

            _logger.LogInformation($"Quiz ended in room {roomId}");

            return Result<QuizRoomResultsDto>.Success(results);
        }

        private int CalculateSpeedBonus(int timeToAnswerMs, int timeLimitMs)
        {
            // Faster answers get higher bonus
            // Linear decrease from MaxSpeedBonus to MinSpeedBonus
            if (timeToAnswerMs >= timeLimitMs)
                return MinSpeedBonus;

            double ratio = 1.0 - ((double)timeToAnswerMs / timeLimitMs);
            int bonus = (int)(MinSpeedBonus + (MaxSpeedBonus - MinSpeedBonus) * ratio);

            return Math.Max(MinSpeedBonus, Math.Min(MaxSpeedBonus, bonus));
        }

    }
}