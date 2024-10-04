

namespace Application.Identities.Commands.ChangePassword
{
    public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
    {
        public ChangePasswordCommandValidator()
        {
            RuleFor(x=>x.OldPassword).NotEmpty().WithMessage("Old Password is required");
            RuleFor(x=>x.NewPassword).NotEmpty().WithMessage("New Passowrd is required");
        }
    }
}