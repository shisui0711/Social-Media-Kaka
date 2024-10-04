
namespace Application.Identities.Commands.CheckPassword
{
    public class CheckPasswordCommandValidator : AbstractValidator<CheckPasswordCommand>
    {
        public CheckPasswordCommandValidator()
        {
            RuleFor(x=>x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}