using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Services.Interfaces;
using LibraryInventory.Domain.Enums;
using LibraryInventory.Infrastructure.Repositories.Interfaces;

namespace LibraryInventory.Application.Services.Implementations;

public class ReportService : IReportService
{
    private readonly IBookRepository _bookRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IInventoryLogRepository _inventoryLogRepository;

    public ReportService(
        IBookRepository bookRepository,
        ICategoryRepository categoryRepository,
        IInventoryLogRepository inventoryLogRepository)
    {
        _bookRepository = bookRepository;
        _categoryRepository = categoryRepository;
        _inventoryLogRepository = inventoryLogRepository;
    }

    public async Task<IReadOnlyList<InventorySummaryDto>> GetInventorySummaryAsync()
    {
        var books = await _bookRepository.GetAllWithCategoryAsync();
        var logs = await _inventoryLogRepository.GetAllWithBookAsync();

        return books.Select(book =>
        {
            var bookLogs = logs.Where(l => l.BookId == book.Id).ToList();
            return new InventorySummaryDto
            {
                BookId = book.Id,
                Title = book.Title,
                TotalStockIn = bookLogs.Where(l => l.TransactionType == TransactionType.StockIn).Sum(l => l.Quantity),
                TotalStockOut = bookLogs.Where(l => l.TransactionType == TransactionType.StockOut).Sum(l => l.Quantity),
                CurrentQuantity = book.Quantity
            };
        }).ToList();
    }

    public async Task<IReadOnlyList<LowStockBookDto>> GetLowStockAsync()
    {
        var books = await _bookRepository.GetLowStockAsync();
        return books.Select(b => new LowStockBookDto
        {
            Id = b.Id,
            Title = b.Title,
            Author = b.Author,
            Quantity = b.Quantity
        }).ToList();
    }

    public async Task<IReadOnlyList<BooksByCategoryDto>> GetBooksByCategoryAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        var books = await _bookRepository.GetAllWithCategoryAsync();

        return categories.Select(category => new BooksByCategoryDto
        {
            Category = category.Name,
            TotalBooks = books.Count(b => b.CategoryId == category.Id)
        }).ToList();
    }
}
