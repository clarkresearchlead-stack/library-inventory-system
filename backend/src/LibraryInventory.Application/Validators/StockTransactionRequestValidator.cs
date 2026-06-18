using FluentValidation;
using LibraryInventory.Application.Requests.Books;

namespace LibraryInventory.Application.Validators;

public class StockTransactionRequestValidator : AbstractValidator<StockTransactionRequest>
{
    public StockTransactionRequestValidator()
    {
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.Remarks).NotEmpty().MaximumLength(500);
    }
}
