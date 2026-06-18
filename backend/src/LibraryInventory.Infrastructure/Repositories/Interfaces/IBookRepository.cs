using LibraryInventory.Domain.Entities;

namespace LibraryInventory.Infrastructure.Repositories.Interfaces;

public interface IBookRepository : IGenericRepository<Book>
{
    Task<IReadOnlyList<Book>> GetAllWithCategoryAsync();
    Task<Book?> GetByIdWithCategoryAsync(int id);
    Task<Book?> GetByIsbnAsync(string isbn);
    Task<IReadOnlyList<Book>> GetLowStockAsync(int threshold = 5);
}
