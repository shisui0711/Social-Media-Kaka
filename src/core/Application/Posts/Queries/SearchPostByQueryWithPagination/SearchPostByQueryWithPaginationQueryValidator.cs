

namespace Application.Posts.Queries.SearchPostByQueryWithPagination
{
    public class SearchPostByQueryWithPaginationQueryValidator : AbstractValidator<SearchPostByQueryWithPaginationQuery>
    {
        public SearchPostByQueryWithPaginationQueryValidator()
        {
            RuleFor(x=>x.q).NotEmpty().WithMessage("Query is required");
            RuleFor(x=>x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x=>x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}