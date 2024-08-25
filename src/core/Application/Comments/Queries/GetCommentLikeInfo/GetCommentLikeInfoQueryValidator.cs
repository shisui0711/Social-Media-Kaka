

namespace Application.Comments.Queries.GetCommentLikeInfo
{
    public class GetCommentLikeInfoQueryValidator : AbstractValidator<GetCommentLikeInfoQuery>
    {
        public GetCommentLikeInfoQueryValidator()
        {
            RuleFor(x=>x.CommentId).NotEmpty().WithMessage("CommentId is required");
        }
    }
}