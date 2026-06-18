namespace LibraryInventory.Application.DTOs.Responses;

public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public CategoryDto? Category { get; set; }
    public string Genre { get; set; } = string.Empty;
    public string Isbn { get; set; } = string.Empty;
    public int PublicationYear { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }
}
