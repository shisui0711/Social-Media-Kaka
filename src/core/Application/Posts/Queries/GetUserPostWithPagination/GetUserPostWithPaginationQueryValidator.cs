

namespace Application.Posts.Queries.GetUserPostWithPagination
{
    public class GetUserPostWithPaginationQueryValidator : AbstractValidator<GetUserPostWithPaginationQuery>
    {
        public GetUserPostWithPaginationQueryValidator()
        {
            RuleFor(x=>x.userId).NotEmpty().WithMessage("userId is required.");
            RuleFor(x=>x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x=>x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}