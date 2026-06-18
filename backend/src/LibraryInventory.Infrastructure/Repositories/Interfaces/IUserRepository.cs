using LibraryInventory.Domain.Entities;

namespace LibraryInventory.Infrastructure.Repositories.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByUsernameAsync(string username);
}
