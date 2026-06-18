using LibraryInventory.Domain.Entities;

namespace LibraryInventory.Infrastructure.Repositories.Interfaces;

public interface IInventoryLogRepository : IGenericRepository<InventoryLog>
{
    Task<IReadOnlyList<InventoryLog>> GetAllWithBookAsync();
}
