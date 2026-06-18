using AutoMapper;
using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Exceptions;
using LibraryInventory.Application.Requests.Categories;
using LibraryInventory.Application.Services.Interfaces;
using LibraryInventory.Domain.Entities;
using LibraryInventory.Infrastructure.Repositories.Interfaces;

namespace LibraryInventory.Application.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<CategoryDto>>(categories);
    }

    public async Task<CategoryDto> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Category with id {id} not found.");
        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
    {
        if (await _categoryRepository.GetByNameAsync(request.Name) is not null)
            throw new ConflictException("A category with this name already exists.");

        var category = new Category
        {
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        await _categoryRepository.AddAsync(category);
        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> UpdateAsync(int id, UpdateCategoryRequest request)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Category with id {id} not found.");

        var existing = await _categoryRepository.GetByNameAsync(request.Name);
        if (existing is not null && existing.Id != id)
            throw new ConflictException("A category with this name already exists.");

        category.Name = request.Name;
        await _categoryRepository.UpdateAsync(category);
        return _mapper.Map<CategoryDto>(category);
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Category with id {id} not found.");

        if (await _categoryRepository.HasBooksAsync(id))
            throw new BadRequestException("Cannot delete category that has linked books.");

        await _categoryRepository.DeleteAsync(category);
    }
}
