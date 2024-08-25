
namespace Application.Bookmarks.Commands.UnBookmarkPost
{
    public class UnBookmarkPostCommandValidator : AbstractValidator<UnBookmarkPostCommand>
    {
        public UnBookmarkPostCommandValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}