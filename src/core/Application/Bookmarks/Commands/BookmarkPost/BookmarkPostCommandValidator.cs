

namespace Application.Bookmarks.Commands.BookmarkPost
{
    public class BookmarkPostCommandValidator : AbstractValidator<BookmarkPostCommand>
    {
        public BookmarkPostCommandValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}