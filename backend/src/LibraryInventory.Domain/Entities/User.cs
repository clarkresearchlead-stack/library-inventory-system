using LibraryInventory.Domain.Common;

namespace LibraryInventory.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = Enums.UserRole.Admin;
}
