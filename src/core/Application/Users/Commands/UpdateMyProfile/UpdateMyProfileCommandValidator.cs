

namespace Application.Users.Commands.UpdateMyProfile
{
    public class UpdateMyProfileCommandValidator : AbstractValidator<UpdateMyProfileCommand>
    {
        public UpdateMyProfileCommandValidator()
        {
            RuleFor(x=>x.UserName).NotEmpty().WithMessage("User name is required");
            RuleFor(x=>x.FirstName).NotEmpty().WithMessage("First name is required");
            RuleFor(x=>x.LastName).NotEmpty().WithMessage("Last name is required");
        }
    }
}