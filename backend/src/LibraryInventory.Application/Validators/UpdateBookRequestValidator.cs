using FluentValidation;
using LibraryInventory.Application.Requests.Books;

namespace LibraryInventory.Application.Validators;

public class UpdateBookRequestValidator : AbstractValidator<UpdateBookRequest>
{
    public UpdateBookRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Author).NotEmpty().MaximumLength(150);
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.Genre).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Isbn).NotEmpty().MaximumLength(20);
        RuleFor(x => x.PublicationYear).InclusiveBetween(1000, DateTime.UtcNow.Year);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}
