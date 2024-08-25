

namespace Application.Users.Commands.UnFriend
{
    public class UnFriendCommandValidator : AbstractValidator<UnFriendCommand>
    {
        public UnFriendCommandValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("UserId is required");
        }
    }
}