using LibraryInventory.Domain.Entities;
using LibraryInventory.Infrastructure.Data;
using LibraryInventory.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryInventory.Infrastructure.Repositories.Implementations;

public class InventoryLogRepository : GenericRepository<InventoryLog>, IInventoryLogRepository
{
    public InventoryLogRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<InventoryLog>> GetAllWithBookAsync() =>
        await DbSet.Include(l => l.Book)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
}
