namespace LibraryInventory.Application.DTOs.Responses;

public class InventorySummaryDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int TotalStockIn { get; set; }
    public int TotalStockOut { get; set; }
    public int CurrentQuantity { get; set; }
}

public class LowStockBookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class BooksByCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public int TotalBooks { get; set; }
}
