using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsRoomCreatorAndSelectedAnswerIdsColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRoomCreator",
                table: "QuizRoomParticipants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SelectedAnswerIds",
                table: "QuizRoomAnswers",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRoomCreator",
                table: "QuizRoomParticipants");

            migrationBuilder.DropColumn(
                name: "SelectedAnswerIds",
                table: "QuizRoomAnswers");
        }
    }
}
