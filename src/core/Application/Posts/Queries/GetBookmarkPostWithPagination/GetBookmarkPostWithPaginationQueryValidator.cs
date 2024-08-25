

namespace Application.Posts.Queries.GetBookmarkPostWithPagination
{
    public class GetBookmarkPostWithPaginationQueryValidator : AbstractValidator<GetBookmarkPostWithPaginationQuery>
    {
        public GetBookmarkPostWithPaginationQueryValidator()
        {
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }

    }
}