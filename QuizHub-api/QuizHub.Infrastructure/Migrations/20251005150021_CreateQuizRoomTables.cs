using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateQuizRoomTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuizRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    RoomCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    QuizId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    ScheduledStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActualStartTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    MaxParticipants = table.Column<int>(type: "int", nullable: false),
                    CurrentQuestionIndex = table.Column<int>(type: "int", nullable: false),
                    CurrentQuestionStartTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizRooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizRooms_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuizRooms_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuizRoomParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuizRoomId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LeftAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Score = table.Column<int>(type: "int", nullable: false),
                    CorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    TotalAnswers = table.Column<int>(type: "int", nullable: false),
                    IsConnected = table.Column<bool>(type: "bit", nullable: false),
                    ConnectionId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizRoomParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizRoomParticipants_QuizRooms_QuizRoomId",
                        column: x => x.QuizRoomId,
                        principalTable: "QuizRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizRoomParticipants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuizRoomAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuizRoomParticipantId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    SelectedAnswerId = table.Column<int>(type: "int", nullable: true),
                    TextAnswer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeToAnswerMs = table.Column<int>(type: "int", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    PointsEarned = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizRoomAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizRoomAnswers_Answers_SelectedAnswerId",
                        column: x => x.SelectedAnswerId,
                        principalTable: "Answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuizRoomAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuizRoomAnswers_QuizRoomParticipants_QuizRoomParticipantId",
                        column: x => x.QuizRoomParticipantId,
                        principalTable: "QuizRoomParticipants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizRoomAnswers_QuestionId",
                table: "QuizRoomAnswers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizRoomAnswers_QuizRoomParticipantId",
                table: "QuizRoomAnswers",
                column: "QuizRoomParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizRoomAnswers_SelectedAnswerId",
                table: "QuizRoomAnswers",
                column: "SelectedAnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizRoomParticipants_QuizRoomId_UserId",
                table: "QuizRoomParticipants",
                columns: new[] { "QuizRoomId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuizRoomParticipants_UserId",
                table: "QuizRoomParticipants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizRooms_CreatedBy",
                table: "QuizRooms",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_QuizRooms_QuizId",
                table: "QuizRooms",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizRooms_RoomCode",
                table: "QuizRooms",
                column: "RoomCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizRoomAnswers");

            migrationBuilder.DropTable(
                name: "QuizRoomParticipants");

            migrationBuilder.DropTable(
                name: "QuizRooms");
        }
    }
}
