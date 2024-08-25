

namespace Application.Posts.Queries.GetLikeInfo
{
    public class GetLikeInfoQueryValidator : AbstractValidator<GetLikeInfoQuery>
    {
        public GetLikeInfoQueryValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}