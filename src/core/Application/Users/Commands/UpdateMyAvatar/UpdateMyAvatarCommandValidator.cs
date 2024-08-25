

namespace Application.Users.Commands.UpdateMyAvatar
{
    public class UpdateMyAvatarCommandValidator : AbstractValidator<UpdateMyAvatarCommand>
    {
        public UpdateMyAvatarCommandValidator()
        {
            RuleFor(x=>x.AvatarUrl).NotEmpty().WithMessage("Avatar url is required");
        }
    }
}