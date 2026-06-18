using LibraryInventory.Domain.Entities;
using LibraryInventory.Infrastructure.Data;
using LibraryInventory.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryInventory.Infrastructure.Repositories.Implementations;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByUsernameAsync(string username) =>
        await DbSet.FirstOrDefaultAsync(u => u.Username == username);
}
