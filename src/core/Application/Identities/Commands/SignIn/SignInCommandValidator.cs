

namespace Application.Identities.Commands.SignIn
{
    public class SignInCommandValidator : AbstractValidator<SignInCommand>
    {
        public SignInCommandValidator()
        {
            RuleFor(x=>x.Username).NotEmpty().WithMessage("Username is required");
            RuleFor(x=>x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}