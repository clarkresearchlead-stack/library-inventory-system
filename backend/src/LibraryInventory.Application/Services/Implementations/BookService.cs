using AutoMapper;
using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Exceptions;
using LibraryInventory.Application.Requests.Books;
using LibraryInventory.Application.Services.Interfaces;
using LibraryInventory.Domain.Entities;
using LibraryInventory.Infrastructure.Repositories.Interfaces;

namespace LibraryInventory.Application.Services.Implementations;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IInventoryLogRepository _inventoryLogRepository;
    private readonly IMapper _mapper;

    public BookService(
        IBookRepository bookRepository,
        ICategoryRepository categoryRepository,
        IInventoryLogRepository inventoryLogRepository,
        IMapper mapper)
    {
        _bookRepository = bookRepository;
        _categoryRepository = categoryRepository;
        _inventoryLogRepository = inventoryLogRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<BookDto>> GetAllAsync()
    {
        var books = await _bookRepository.GetAllWithCategoryAsync();
        return _mapper.Map<IReadOnlyList<BookDto>>(books);
    }

    public async Task<BookDto> GetByIdAsync(int id)
    {
        var book = await _bookRepository.GetByIdWithCategoryAsync(id)
            ?? throw new NotFoundException($"Book with id {id} not found.");
        return _mapper.Map<BookDto>(book);
    }

    public async Task<IReadOnlyList<BookDto>> GetLowStockAsync()
    {
        var books = await _bookRepository.GetLowStockAsync();
        return _mapper.Map<IReadOnlyList<BookDto>>(books);
    }

    public async Task<BookDto> CreateAsync(CreateBookRequest request)
    {
        await EnsureCategoryExistsAsync(request.CategoryId);
        await EnsureIsbnUniqueAsync(request.Isbn);

        var book = new Book
        {
            Title = request.Title,
            Author = request.Author,
            CategoryId = request.CategoryId,
            Genre = request.Genre,
            Isbn = request.Isbn,
            PublicationYear = request.PublicationYear,
            Quantity = request.Quantity,
            CreatedAt = DateTime.UtcNow
        };

        await _bookRepository.AddAsync(book);
        var created = await _bookRepository.GetByIdWithCategoryAsync(book.Id);
        return _mapper.Map<BookDto>(created);
    }

    public async Task<BookDto> UpdateAsync(int id, UpdateBookRequest request)
    {
        var book = await _bookRepository.GetByIdWithCategoryAsync(id)
            ?? throw new NotFoundException($"Book with id {id} not found.");

        await EnsureCategoryExistsAsync(request.CategoryId);

        var existingIsbn = await _bookRepository.GetByIsbnAsync(request.Isbn);
        if (existingIsbn is not null && existingIsbn.Id != id)
            throw new ConflictException("A book with this ISBN already exists.");

        book.Title = request.Title;
        book.Author = request.Author;
        book.CategoryId = request.CategoryId;
        book.Genre = request.Genre;
        book.Isbn = request.Isbn;
        book.PublicationYear = request.PublicationYear;
        book.Quantity = request.Quantity;

        await _bookRepository.UpdateAsync(book);
        var updated = await _bookRepository.GetByIdWithCategoryAsync(id);
        return _mapper.Map<BookDto>(updated);
    }

    public async Task DeleteAsync(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Book with id {id} not found.");
        await _bookRepository.DeleteAsync(book);
    }

    public async Task StockInAsync(int id, StockTransactionRequest request)
    {
        var book = await _bookRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Book with id {id} not found.");

        book.Quantity += request.Quantity;
        await _bookRepository.UpdateAsync(book);

        await _inventoryLogRepository.AddAsync(new InventoryLog
        {
            BookId = book.Id,
            TransactionType = Domain.Enums.TransactionType.StockIn,
            Quantity = request.Quantity,
            Remarks = request.Remarks,
            CreatedAt = DateTime.UtcNow
        });
    }

    public async Task StockOutAsync(int id, StockTransactionRequest request)
    {
        var book = await _bookRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Book with id {id} not found.");

        if (book.Quantity - request.Quantity < 0)
            throw new BadRequestException("Insufficient stock for this transaction.");

        book.Quantity -= request.Quantity;
        await _bookRepository.UpdateAsync(book);

        await _inventoryLogRepository.AddAsync(new InventoryLog
        {
            BookId = book.Id,
            TransactionType = Domain.Enums.TransactionType.StockOut,
            Quantity = request.Quantity,
            Remarks = request.Remarks,
            CreatedAt = DateTime.UtcNow
        });
    }

    private async Task EnsureCategoryExistsAsync(int categoryId)
    {
        if (await _categoryRepository.GetByIdAsync(categoryId) is null)
            throw new NotFoundException($"Category with id {categoryId} not found.");
    }

    private async Task EnsureIsbnUniqueAsync(string isbn)
    {
        if (await _bookRepository.GetByIsbnAsync(isbn) is not null)
            throw new ConflictException("A book with this ISBN already exists.");
    }
}
