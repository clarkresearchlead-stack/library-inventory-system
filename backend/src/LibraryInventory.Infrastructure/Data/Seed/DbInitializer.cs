using LibraryInventory.Domain.Entities;
using LibraryInventory.Domain.Enums;
using LibraryInventory.Infrastructure.Data;
using LibraryInventory.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace LibraryInventory.Infrastructure.Data.Seed;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (context.Database.IsSqlite())
            await context.Database.EnsureCreatedAsync();
        else
            await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync())
            return;

        var now = DateTime.UtcNow;

        var admin = new User
        {
            Username = "admin",
            PasswordHash = PasswordHasher.Hash("admin123"),
            Role = UserRole.Admin,
            CreatedAt = now
        };

        var categories = new List<Category>
        {
            new() { Name = "Fiction", CreatedAt = now },
            new() { Name = "Non-Fiction", CreatedAt = now },
            new() { Name = "Science", CreatedAt = now },
            new() { Name = "History", CreatedAt = now },
            new() { Name = "Technology", CreatedAt = now }
        };

        context.Users.Add(admin);
        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();

        var books = new List<Book>
        {
            new() { Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", CategoryId = categories[0].Id, Genre = "Classic", Isbn = "978-0743273565", PublicationYear = 1925, Quantity = 10, CreatedAt = now },
            new() { Title = "To Kill a Mockingbird", Author = "Harper Lee", CategoryId = categories[0].Id, Genre = "Classic", Isbn = "978-0061120084", PublicationYear = 1960, Quantity = 3, CreatedAt = now },
            new() { Title = "Sapiens", Author = "Yuval Noah Harari", CategoryId = categories[1].Id, Genre = "Anthropology", Isbn = "978-0062316097", PublicationYear = 2011, Quantity = 8, CreatedAt = now },
            new() { Title = "A Brief History of Time", Author = "Stephen Hawking", CategoryId = categories[2].Id, Genre = "Physics", Isbn = "978-0553380163", PublicationYear = 1988, Quantity = 4, CreatedAt = now },
            new() { Title = "The Code Breaker", Author = "Walter Isaacson", CategoryId = categories[2].Id, Genre = "Biography", Isbn = "978-1982115852", PublicationYear = 2021, Quantity = 2, CreatedAt = now },
            new() { Title = "Team of Rivals", Author = "Doris Kearns Goodwin", CategoryId = categories[3].Id, Genre = "Biography", Isbn = "978-0743270755", PublicationYear = 2005, Quantity = 6, CreatedAt = now },
            new() { Title = "Clean Code", Author = "Robert C. Martin", CategoryId = categories[4].Id, Genre = "Programming", Isbn = "978-0132350884", PublicationYear = 2008, Quantity = 5, CreatedAt = now },
            new() { Title = "The Pragmatic Programmer", Author = "Andrew Hunt", CategoryId = categories[4].Id, Genre = "Programming", Isbn = "978-0201616224", PublicationYear = 1999, Quantity = 1, CreatedAt = now }
        };

        context.Books.AddRange(books);
        await context.SaveChangesAsync();

        var logs = new List<InventoryLog>
        {
            new() { BookId = books[0].Id, TransactionType = TransactionType.StockIn, Quantity = 15, Remarks = "Initial stock", CreatedAt = now.AddDays(-10) },
            new() { BookId = books[0].Id, TransactionType = TransactionType.StockOut, Quantity = 5, Remarks = "Sold copies", CreatedAt = now.AddDays(-5) },
            new() { BookId = books[1].Id, TransactionType = TransactionType.StockIn, Quantity = 10, Remarks = "Initial stock", CreatedAt = now.AddDays(-8) },
            new() { BookId = books[1].Id, TransactionType = TransactionType.StockOut, Quantity = 7, Remarks = "High demand", CreatedAt = now.AddDays(-3) },
            new() { BookId = books[6].Id, TransactionType = TransactionType.StockIn, Quantity = 8, Remarks = "Restock", CreatedAt = now.AddDays(-2) },
            new() { BookId = books[7].Id, TransactionType = TransactionType.StockIn, Quantity = 5, Remarks = "New shipment", CreatedAt = now.AddDays(-1) },
            new() { BookId = books[7].Id, TransactionType = TransactionType.StockOut, Quantity = 4, Remarks = "Student checkout", CreatedAt = now }
        };

        context.InventoryLogs.AddRange(logs);
        await context.SaveChangesAsync();
    }
}
