namespace LibraryInventory.Application.Requests.Books;

public class StockTransactionRequest
{
    public int Quantity { get; set; }
    public string Remarks { get; set; } = string.Empty;
}
