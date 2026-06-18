using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Requests.Auth;

namespace LibraryInventory.Application.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequest request);
}
