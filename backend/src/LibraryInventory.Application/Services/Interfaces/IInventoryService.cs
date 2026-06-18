using LibraryInventory.Application.DTOs.Responses;

namespace LibraryInventory.Application.Services.Interfaces;

public interface IInventoryService
{
    Task<IReadOnlyList<InventoryLogDto>> GetAllLogsAsync();
}
