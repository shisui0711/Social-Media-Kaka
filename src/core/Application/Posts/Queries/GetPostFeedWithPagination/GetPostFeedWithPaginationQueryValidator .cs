
using Application.Posts.Queries.GetPostFeedWithPagination;


namespace Application.Posts.Queries.GetPostFeedWithPanation
{
    public class GetPostFeedWithPaginationQueryValidator : AbstractValidator<GetPostFeedWithPaginationQuery>
    {
        public GetPostFeedWithPaginationQueryValidator ()
        {
            RuleFor(x=>x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x=>x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}