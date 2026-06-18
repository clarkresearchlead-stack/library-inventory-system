using LibraryInventory.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryInventory.Api.Controllers;

[ApiController]
[Route("api/inventory-logs")]
[Authorize(Roles = "Admin")]
public class InventoryLogsController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryLogsController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _inventoryService.GetAllLogsAsync();
        return Ok(logs);
    }
}
