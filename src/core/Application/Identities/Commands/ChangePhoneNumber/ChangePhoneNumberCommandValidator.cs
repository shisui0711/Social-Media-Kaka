
namespace Application.Identities.Commands.ChangePhoneNumber
{
    public class ChangePhoneNumberCommandValidator : AbstractValidator<ChangePhoneNumberCommand>
    {
        public ChangePhoneNumberCommandValidator()
        {
            RuleFor(x=>x.PhoneNumber).NotEmpty().Matches(@"^\+\d{10,15}$").WithMessage("Invalid phone number");
            RuleFor(x=>x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}