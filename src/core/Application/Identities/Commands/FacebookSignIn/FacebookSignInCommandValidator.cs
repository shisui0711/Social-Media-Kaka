

namespace Application.Identities.Commands.FacebookSignIn
{
    public class FacebookSignInCommandValidator : AbstractValidator<FacebookSignInCommand>
    {
        public FacebookSignInCommandValidator()
        {
            RuleFor(x=>x.AccessToken).NotEmpty().WithMessage("Access Token is required");
        }
    }
}