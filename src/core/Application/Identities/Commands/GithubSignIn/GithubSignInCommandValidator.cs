

namespace Application.Identities.Commands.GithubSignIn
{
    public class GithubSignInCommandValidator : AbstractValidator<GithubSignInCommand>
    {
        public GithubSignInCommandValidator()
        {
            RuleFor(x=>x.AccessToken).NotEmpty().WithMessage("Access Token is required");
        }
    }
}