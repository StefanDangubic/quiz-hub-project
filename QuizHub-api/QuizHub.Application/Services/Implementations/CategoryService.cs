using AutoMapper;
using QuizHub.Application.Common;
using QuizHub.Application.DTOs.Category;
using QuizHub.Application.Services.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Interfaces;
using QuizHub.Infrastructure.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Category> _categoryRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;

        public CategoryService(IRepository<Category> categoryRepository, IQuizRepository quizRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _quizRepository = quizRepository;
            _mapper = mapper;
        }

        public async Task<Result<List<CategoryDto>>> GetAllCategoriesAsync()
        {
            try
            {
                var categories = await _categoryRepository.GetAllAsync();
                var categoryDtos = _mapper.Map<List<CategoryDto>>(categories);

                return Result<List<CategoryDto>>.Success(categoryDtos);
            }
            catch (Exception ex)
            {
                return Result<List<CategoryDto>>.Failure($"Error retrieving categories: {ex.Message}");
            }
        }

        public async Task<Result<CategoryDto>> GetCategoryByIdAsync(int categoryId)
        {
            try
            {
                var category = await _categoryRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    return Result<CategoryDto>.Failure("Category not found");
                }

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return Result<CategoryDto>.Success(categoryDto);
            }
            catch (Exception ex)
            {
                return Result<CategoryDto>.Failure($"Error retrieving category: {ex.Message}");
            }
        }

        public async Task<Result<CategoryDto>> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            try
            {
                // Check if category name already exists
                var existingCategory = await _categoryRepository.FirstOrDefaultAsync(c => c.Name == createCategoryDto.Name);
                if (existingCategory != null)
                {
                    return Result<CategoryDto>.Failure("Category with this name already exists");
                }

                var category = _mapper.Map<Category>(createCategoryDto);
                category = await _categoryRepository.AddAsync(category);

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return Result<CategoryDto>.Success(categoryDto, "Category created successfully");
            }
            catch (Exception ex)
            {
                return Result<CategoryDto>.Failure($"Error creating category: {ex.Message}");
            }
        }

        public async Task<Result<CategoryDto>> UpdateCategoryAsync(int categoryId, CreateCategoryDto updateCategoryDto)
        {
            try
            {
                var category = await _categoryRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    return Result<CategoryDto>.Failure("Category not found");
                }

                // Check if new name already exists (excluding current category)
                var existingCategory = await _categoryRepository.FirstOrDefaultAsync(c => c.Name == updateCategoryDto.Name && c.Id != categoryId);
                if (existingCategory != null)
                {
                    return Result<CategoryDto>.Failure("Category with this name already exists");
                }

                category.Name = updateCategoryDto.Name;
                category.Description = updateCategoryDto.Description;

                await _categoryRepository.UpdateAsync(category);

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return Result<CategoryDto>.Success(categoryDto, "Category updated successfully");
            }
            catch (Exception ex)
            {
                return Result<CategoryDto>.Failure($"Error updating category: {ex.Message}");
            }
        }

        public async Task<Result> DeleteCategoryAsync(int categoryId)
        {
            try
            {
                var category = await _categoryRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    return Result.Failure("Category not found");
                }

                var hasQuizzes = await _quizRepository.HasQuizzesInCategoryAsync(categoryId);
                if (hasQuizzes)
                {
                    return Result.Failure("Cannot delete category that contains quizzes. Move or delete the quizzes first.");
                }


                await _categoryRepository.DeleteAsync(category);
                return Result.Success("Category deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting category: {ex.Message}");
            }
        }
    }
}
