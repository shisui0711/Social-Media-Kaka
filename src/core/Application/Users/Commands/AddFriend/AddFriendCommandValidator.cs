
namespace Application.Users.Commands.AddFriend
{
    public class AddFriendCommandValidator : AbstractValidator<AddFriendCommand>
    {
        public AddFriendCommandValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("UserId is required");
        }
    }
}