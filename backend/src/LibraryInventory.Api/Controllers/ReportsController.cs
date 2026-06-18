using LibraryInventory.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryInventory.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("inventory-summary")]
    public async Task<IActionResult> GetInventorySummary()
    {
        var summary = await _reportService.GetInventorySummaryAsync();
        return Ok(summary);
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var report = await _reportService.GetLowStockAsync();
        return Ok(report);
    }

    [HttpGet("books-by-category")]
    public async Task<IActionResult> GetBooksByCategory()
    {
        var report = await _reportService.GetBooksByCategoryAsync();
        return Ok(report);
    }
}
