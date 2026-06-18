using LibraryInventory.Domain.Entities;

namespace LibraryInventory.Infrastructure.Repositories.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<Category?> GetByNameAsync(string name);
    Task<bool> HasBooksAsync(int categoryId);
}
