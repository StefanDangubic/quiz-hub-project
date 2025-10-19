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
    public class QuizRoomConfiguration : IEntityTypeConfiguration<QuizRoom>
    {
        public void Configure(EntityTypeBuilder<QuizRoom> builder)
        {
            builder.ToTable("QuizRooms");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.Description)
                .HasMaxLength(1000);

            builder.Property(r => r.RoomCode)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(r => r.RoomCode)
                .IsUnique();

            builder.HasOne(r => r.Quiz)
                .WithMany()
                .HasForeignKey(r => r.QuizId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Creator)
                .WithMany()
                .HasForeignKey(r => r.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(r => r.Participants)
                .WithOne(p => p.QuizRoom)
                .HasForeignKey(p => p.QuizRoomId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
