
namespace Application.Identities.Commands.GoogleSignIn
{
    public class GoogleSignInCommandValidator : AbstractValidator<GoogleSignInCommand>
    {
        public GoogleSignInCommandValidator()
        {
            RuleFor(x=>x.IdToken).NotEmpty().WithMessage("IdToken is required");
        }
    }
}