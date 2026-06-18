using AutoMapper;
using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Exceptions;
using LibraryInventory.Application.Requests.Auth;
using LibraryInventory.Application.Services.Interfaces;
using LibraryInventory.Infrastructure.Repositories.Interfaces;
using LibraryInventory.Infrastructure.Security;

namespace LibraryInventory.Application.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;

    public AuthService(IUserRepository userRepository, JwtTokenGenerator jwtTokenGenerator, IMapper mapper)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username);

        if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid username or password");

        return new AuthResponseDto
        {
            Token = _jwtTokenGenerator.GenerateToken(user),
            User = _mapper.Map<UserDto>(user)
        };
    }
}
