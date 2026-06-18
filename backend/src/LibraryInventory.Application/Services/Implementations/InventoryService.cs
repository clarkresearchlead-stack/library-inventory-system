using AutoMapper;
using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Application.Services.Interfaces;
using LibraryInventory.Infrastructure.Repositories.Interfaces;

namespace LibraryInventory.Application.Services.Implementations;

public class InventoryService : IInventoryService
{
    private readonly IInventoryLogRepository _inventoryLogRepository;
    private readonly IMapper _mapper;

    public InventoryService(IInventoryLogRepository inventoryLogRepository, IMapper mapper)
    {
        _inventoryLogRepository = inventoryLogRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<InventoryLogDto>> GetAllLogsAsync()
    {
        var logs = await _inventoryLogRepository.GetAllWithBookAsync();
        return _mapper.Map<IReadOnlyList<InventoryLogDto>>(logs);
    }
}
