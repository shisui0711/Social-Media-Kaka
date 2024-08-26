

namespace Application.Users.Queries.GetMyFriendsWithPagination
{
    public class GetMyFriendsWithPaginationQueryValidator : AbstractValidator<GetMyFriendsWithPaginationQuery>
    {
        public GetMyFriendsWithPaginationQueryValidator()
        {
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}