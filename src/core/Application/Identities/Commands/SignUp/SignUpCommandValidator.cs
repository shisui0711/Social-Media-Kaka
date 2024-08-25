
namespace Application.Identities.Commands.SignUp
{
    public class SignUpCommandValidator : AbstractValidator<SignUpCommand>
    {
        public SignUpCommandValidator()
        {
            RuleFor(x=>x.Username).NotEmpty().WithMessage("Please enter your username");
            RuleFor(x=>x.Email).EmailAddress().WithMessage("Please enter a valid email address");
            RuleFor(x=>x.FirstName).NotEmpty().WithMessage("Please enter your first name");
            RuleFor(x=>x.LastName).NotEmpty().WithMessage("Please enter your last name");
            RuleFor(x=>x.Password).NotEmpty().WithMessage("Please enter your password")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long");
        }
    }
}