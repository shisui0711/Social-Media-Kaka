
namespace Application.Users.Commands.UnFollowUser
{
    public class UnFollowUserCommandValidator : AbstractValidator<UnFollowUserCommand>
    {
        public UnFollowUserCommandValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("User Id is required");
        }
    }
}