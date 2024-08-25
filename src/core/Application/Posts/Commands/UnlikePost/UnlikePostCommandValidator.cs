

namespace Application.Posts.Commands.UnlikePost
{
    public class UnlikePostCommandValidator : AbstractValidator<UnlikePostCommand>
    {
        public UnlikePostCommandValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}