using LibraryInventory.Application.DTOs.Responses;

namespace LibraryInventory.Application.Services.Interfaces;

public interface IReportService
{
    Task<IReadOnlyList<InventorySummaryDto>> GetInventorySummaryAsync();
    Task<IReadOnlyList<LowStockBookDto>> GetLowStockAsync();
    Task<IReadOnlyList<BooksByCategoryDto>> GetBooksByCategoryAsync();
}
