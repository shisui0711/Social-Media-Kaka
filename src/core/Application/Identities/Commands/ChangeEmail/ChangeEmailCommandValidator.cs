

namespace Application.Identities.Commands.ChangeEmail
{
    public class ChangeEmailCommandValidator : AbstractValidator<ChangeEmailCommand>
    {
        public ChangeEmailCommandValidator()
        {
            RuleFor(x=>x.Email).NotEmpty().EmailAddress().WithMessage("Invalid email");
            RuleFor(x=>x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}