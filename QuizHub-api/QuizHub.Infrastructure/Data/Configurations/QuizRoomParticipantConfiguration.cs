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
    public class QuizRoomParticipantConfiguration : IEntityTypeConfiguration<QuizRoomParticipant>
    {
        public void Configure(EntityTypeBuilder<QuizRoomParticipant> builder)
        {
            builder.ToTable("QuizRoomParticipants");

            builder.HasKey(p => p.Id);

            builder.HasIndex(p => new { p.QuizRoomId, p.UserId })
                .IsUnique();

            builder.HasOne(p => p.QuizRoom)
                .WithMany(r => r.Participants)
                .HasForeignKey(p => p.QuizRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(p => p.Answers)
                .WithOne(a => a.Participant)
                .HasForeignKey(a => a.QuizRoomParticipantId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
