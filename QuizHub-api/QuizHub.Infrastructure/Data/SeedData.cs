using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Infrastructure.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace QuizHub.Infrastructure.Data
{
  public static class SeedData
    {
        public static async Task SeedAdminUserAsync(QuizHubDbContext context, IConfiguration configuration)
        {
            string adminEmail = configuration["DefaultAdmin:Email"];
            string adminPassword = configuration["DefaultAdmin:Password"];

            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
            {
                throw new InvalidOperationException("Default admin credentials are not configured.");
            }

            if (!await context.Users.AnyAsync(u => u.Email == adminEmail))
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    Role = UserRole.Admin,
                    IsActive = true
                };

                await context.Users.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }
        }
    }
}
