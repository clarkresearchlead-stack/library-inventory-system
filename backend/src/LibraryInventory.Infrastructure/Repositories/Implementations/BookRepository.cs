using LibraryInventory.Domain.Entities;
using LibraryInventory.Infrastructure.Data;
using LibraryInventory.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryInventory.Infrastructure.Repositories.Implementations;

public class BookRepository : GenericRepository<Book>, IBookRepository
{
    public BookRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Book>> GetAllWithCategoryAsync() =>
        await DbSet.Include(b => b.Category).OrderBy(b => b.Title).ToListAsync();

    public async Task<Book?> GetByIdWithCategoryAsync(int id) =>
        await DbSet.Include(b => b.Category).FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Book?> GetByIsbnAsync(string isbn) =>
        await DbSet.FirstOrDefaultAsync(b => b.Isbn == isbn);

    public async Task<IReadOnlyList<Book>> GetLowStockAsync(int threshold = 5) =>
        await DbSet.Include(b => b.Category)
            .Where(b => b.Quantity <= threshold)
            .OrderBy(b => b.Quantity)
            .ToListAsync();
}
