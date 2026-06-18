using LibraryInventory.Domain.Entities;
using LibraryInventory.Infrastructure.Data;
using LibraryInventory.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryInventory.Infrastructure.Repositories.Implementations;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }

    public async Task<Category?> GetByNameAsync(string name) =>
        await DbSet.FirstOrDefaultAsync(c => c.Name == name);

    public async Task<bool> HasBooksAsync(int categoryId) =>
        await Context.Books.AnyAsync(b => b.CategoryId == categoryId);
}
