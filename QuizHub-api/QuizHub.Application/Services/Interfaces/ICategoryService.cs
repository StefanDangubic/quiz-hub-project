using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Category;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<List<CategoryDto>>> GetAllCategoriesAsync();
        Task<Result<CategoryDto>> GetCategoryByIdAsync(int categoryId);
        Task<Result<CategoryDto>> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<Result<CategoryDto>> UpdateCategoryAsync(int categoryId, CreateCategoryDto updateCategoryDto);
        Task<Result> DeleteCategoryAsync(int categoryId);
    }
}
