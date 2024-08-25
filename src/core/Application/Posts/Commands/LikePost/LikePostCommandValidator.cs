

namespace Application.Posts.Commands.LikePost
{
    public class LikePostCommandValidator : AbstractValidator<LikePostCommand>
    {
        public LikePostCommandValidator()
        {
            RuleFor(x => x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}