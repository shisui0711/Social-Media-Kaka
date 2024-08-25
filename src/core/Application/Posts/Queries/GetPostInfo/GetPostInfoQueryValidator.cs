

namespace Application.Posts.Queries.GetPostInfo
{
    public class GetPostInfoQueryValidator : AbstractValidator<GetPostInfoQuery>
    {
        public GetPostInfoQueryValidator()
        {
            RuleFor(x => x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}