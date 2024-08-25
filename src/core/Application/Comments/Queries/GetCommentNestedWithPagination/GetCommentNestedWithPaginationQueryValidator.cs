

namespace Application.Comments.Queries.GetCommentNestedWithPagination
{
    public class GetCommentNestedWithPaginationQueryValidator : AbstractValidator<GetCommentNestedWithPaginationQuery>
    {
        public GetCommentNestedWithPaginationQueryValidator()
        {
            RuleFor(x=>x.CommentId).NotEmpty().WithMessage("CommentId is required");
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}