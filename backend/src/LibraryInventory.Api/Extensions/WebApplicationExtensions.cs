using LibraryInventory.Infrastructure.Data;
using LibraryInventory.Infrastructure.Data.Seed;

namespace LibraryInventory.Api.Extensions;

public static class WebApplicationExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await DbInitializer.InitializeAsync(context);
    }
}
