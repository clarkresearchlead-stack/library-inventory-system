using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Requests.Books;

namespace LibraryInventory.Application.Services.Interfaces;

public interface IBookService
{
    Task<IReadOnlyList<BookDto>> GetAllAsync();
    Task<BookDto> GetByIdAsync(int id);
    Task<IReadOnlyList<BookDto>> GetLowStockAsync();
    Task<BookDto> CreateAsync(CreateBookRequest request);
    Task<BookDto> UpdateAsync(int id, UpdateBookRequest request);
    Task DeleteAsync(int id);
    Task StockInAsync(int id, StockTransactionRequest request);
    Task StockOutAsync(int id, StockTransactionRequest request);
}
