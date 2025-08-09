using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Common;
using QuizHub.Infrastructure.Services;
using QuizHub_api.Attributes;

namespace QuizHub_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {

        private readonly ICloudinaryService _cloudinaryService;

        public UploadController(ICloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        /// <summary>
        /// Upload profile image
        /// </summary>
        [HttpPost("profile-image")]
     //   [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> UploadProfileImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("No file provided"));
                }

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
                }

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("File size cannot exceed 5MB"));
                }

                var imageUrl = await _cloudinaryService.UploadImageAsync(file, "kvizhub/profile-images");

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Failed to upload image"));
                }

                return Ok(ApiResponse<string>.SuccessResponse(imageUrl, "Image uploaded successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse($"Upload failed: {ex.Message}"));
            }
        }

    }
}
