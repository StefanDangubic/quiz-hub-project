using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Data.Configurations
{
    public class QuizRoomAnswerConfiguration : IEntityTypeConfiguration<QuizRoomAnswer>
    {
        public void Configure(EntityTypeBuilder<QuizRoomAnswer> builder)
        {
            builder.ToTable("QuizRoomAnswers");

            builder.HasKey(a => a.Id);

            builder.HasOne(a => a.Participant)
                .WithMany(p => p.Answers)
                .HasForeignKey(a => a.QuizRoomParticipantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.Question)
                .WithMany()
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.SelectedAnswer)
                .WithMany()
                .HasForeignKey(a => a.SelectedAnswerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(a => a.SelectedAnswerIds)
                .HasMaxLength(500);
        }
    }
}
