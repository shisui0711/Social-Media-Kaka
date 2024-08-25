
namespace Application.Comments.Queries.GetCommentsPostWithPagination
{
    public class GetCommentsPostWithPaginationQueryValidator : AbstractValidator<GetCommentsPostWithPaginationQuery>
    {
        public GetCommentsPostWithPaginationQueryValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required.");
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}