using LibraryInventory.Domain.Common;

namespace LibraryInventory.Domain.Entities;

public class InventoryLog : BaseEntity
{
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;
    public string TransactionType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Remarks { get; set; } = string.Empty;
}
