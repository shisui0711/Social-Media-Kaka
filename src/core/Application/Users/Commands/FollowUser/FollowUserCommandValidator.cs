

namespace Application.Users.Commands.FollowUser
{
    public class FollowUserCommandValidator : AbstractValidator<FollowUserCommand>
    {
        public FollowUserCommandValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("User Id is required");
        }
    }
}