using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Category;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Enums;
using QuizHub_api.Attributes;

namespace QuizHub_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesController : ControllerBase
    {

        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Get all categories
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetCategories()
        {
            var result = await _categoryService.GetAllCategoriesAsync();

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<List<CategoryDto>>.SuccessResponse(result.Data!));
            }

            return BadRequest(ApiResponse<List<CategoryDto>>.ErrorResponse(result.Message, result.Errors));
        }

        /// <summary>
        /// Get category by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryDto>>> GetCategory(int id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<CategoryDto>.SuccessResponse(result.Data!));
            }

            return NotFound(ApiResponse<CategoryDto>.ErrorResponse(result.Message));
        }

        /// <summary>
        /// Create new category (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(UserRole.Admin)]
        public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory([FromBody] CreateCategoryDto createCategoryDto)
        {
            var result = await _categoryService.CreateCategoryAsync(createCategoryDto);

            if (result.IsSuccess)
            {
                return CreatedAtAction(nameof(GetCategory), new { id = result.Data!.Id },
                    ApiResponse<CategoryDto>.SuccessResponse(result.Data, result.Message));
            }

            return BadRequest(ApiResponse<CategoryDto>.ErrorResponse(result.Message, result.Errors));
        }

        /// <summary>
        /// Update category (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(UserRole.Admin)]
        public async Task<ActionResult<ApiResponse<CategoryDto>>> UpdateCategory(int id, [FromBody] CreateCategoryDto updateCategoryDto)
        {

            var result = await _categoryService.UpdateCategoryAsync(id, updateCategoryDto);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<CategoryDto>.SuccessResponse(result.Data!, result.Message));
            }

            return BadRequest(ApiResponse<CategoryDto>.ErrorResponse(result.Message, result.Errors));
        }

        /// <summary>
        /// Delete category (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(UserRole.Admin)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);

            if (result.IsSuccess)
            {
                return Ok(ApiResponse<object>.SuccessResponse(null, result.Message));
            }

            return BadRequest(ApiResponse<object>.ErrorResponse(result.Message, result.Errors));
        }
    }
}
