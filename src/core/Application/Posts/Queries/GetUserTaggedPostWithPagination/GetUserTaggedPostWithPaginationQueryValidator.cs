
namespace Application.Posts.Queries.GetUserTaggedPostWithPagination
{
    public class GetUserTaggedPostWithPaginationQueryValidator : AbstractValidator<GetUserTaggedPostWithPaginationQuery>
    {
        public GetUserTaggedPostWithPaginationQueryValidator()
        {
            RuleFor(x=>x.UserName).NotEmpty().WithMessage("UserName is required.");
            RuleFor(x=>x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x=>x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}