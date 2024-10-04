
namespace Application.Identities.Commands.VerifyTwoFactorToken
{
    public class VerifyTwoFactorTokenValidator : AbstractValidator<VerifyTwoFactorTokenCommand>
    {
        public VerifyTwoFactorTokenValidator()
        {
            RuleFor(x=>x.Token).NotEmpty().MinimumLength(6).WithMessage("Invalid Token");
        }
    }
}