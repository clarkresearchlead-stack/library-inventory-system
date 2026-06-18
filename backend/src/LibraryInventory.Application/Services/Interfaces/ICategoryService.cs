using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Requests.Categories;

namespace LibraryInventory.Application.Services.Interfaces;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllAsync();
    Task<CategoryDto> GetByIdAsync(int id);
    Task<CategoryDto> CreateAsync(CreateCategoryRequest request);
    Task<CategoryDto> UpdateAsync(int id, UpdateCategoryRequest request);
    Task DeleteAsync(int id);
}
