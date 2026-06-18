using AutoMapper;
using LibraryInventory.Application.DTOs.Responses;
using LibraryInventory.Domain.Entities;

namespace LibraryInventory.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<Category, CategoryDto>();
        CreateMap<Book, BookDto>();
        CreateMap<InventoryLog, InventoryLogDto>()
            .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book != null ? src.Book.Title : null));
    }
}
