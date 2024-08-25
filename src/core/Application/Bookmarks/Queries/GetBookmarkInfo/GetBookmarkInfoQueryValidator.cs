

namespace Application.Bookmarks.Queries.GetBookmarkInfo
{
    public class GetBookmarkInfoQueryValidator : AbstractValidator<GetBookmarkInfoQuery>
    {
        public GetBookmarkInfoQueryValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}