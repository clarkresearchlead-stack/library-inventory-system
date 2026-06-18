using FluentValidation;
using LibraryInventory.Application.Requests.Books;
using LibraryInventory.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryInventory.Api.Controllers;

[ApiController]
[Route("api/books")]
[Authorize(Roles = "Admin")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly IValidator<CreateBookRequest> _createValidator;
    private readonly IValidator<UpdateBookRequest> _updateValidator;
    private readonly IValidator<StockTransactionRequest> _stockValidator;

    public BooksController(
        IBookService bookService,
        IValidator<CreateBookRequest> createValidator,
        IValidator<UpdateBookRequest> updateValidator,
        IValidator<StockTransactionRequest> stockValidator)
    {
        _bookService = bookService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _stockValidator = stockValidator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _bookService.GetAllAsync();
        return Ok(books);
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var books = await _bookService.GetLowStockAsync();
        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await _bookService.GetByIdAsync(id);
        return Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookRequest request)
    {
        await _createValidator.ValidateAndThrowAsync(request);
        var book = await _bookService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBookRequest request)
    {
        await _updateValidator.ValidateAndThrowAsync(request);
        var book = await _bookService.UpdateAsync(id, request);
        return Ok(book);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _bookService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id:int}/stock-in")]
    public async Task<IActionResult> StockIn(int id, [FromBody] StockTransactionRequest request)
    {
        await _stockValidator.ValidateAndThrowAsync(request);
        await _bookService.StockInAsync(id, request);
        return NoContent();
    }

    [HttpPatch("{id:int}/stock-out")]
    public async Task<IActionResult> StockOut(int id, [FromBody] StockTransactionRequest request)
    {
        await _stockValidator.ValidateAndThrowAsync(request);
        await _bookService.StockOutAsync(id, request);
        return NoContent();
    }
}
