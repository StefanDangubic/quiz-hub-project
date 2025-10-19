using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Common;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Data.Context
{
    public class QuizHubDbContext : DbContext
    {

        public QuizHubDbContext(DbContextOptions<QuizHubDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<QuizAttempt> QuizAttempts { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }

        public DbSet<QuizRoom> QuizRooms { get; set; }
        public DbSet<QuizRoomParticipant> QuizRoomParticipants { get; set; }
        public DbSet<QuizRoomAnswer> QuizRoomAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply all configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(QuizHubDbContext).Assembly);

            // Configure enums to be stored as integers
            modelBuilder.Entity<User>()
                .Property(e => e.Role)
                .HasConversion<int>();

            modelBuilder.Entity<Quiz>()
                .Property(e => e.DifficultyLevel)
                .HasConversion<int>();

            modelBuilder.Entity<Question>()
                .Property(e => e.QuestionType)
                .HasConversion<int>();

            modelBuilder.Entity<QuizRoom>()
               .Property(e => e.Status)
               .HasConversion<int>();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditableEntities();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateAuditableEntities()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }
        }
    }
}
