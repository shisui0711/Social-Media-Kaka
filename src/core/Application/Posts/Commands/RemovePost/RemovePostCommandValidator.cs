
namespace Application.Posts.Commands.RemovePost
{
    public class RemovePostCommandValidator : AbstractValidator<RemovePostCommand>
    {
        public RemovePostCommandValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}