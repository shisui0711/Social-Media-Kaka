
namespace Application.Users.Queries.GetFollowInfo
{
    public class GetFollowInfoQueryValidator : AbstractValidator<GetFollowInfoQuery>
    {
        public GetFollowInfoQueryValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("User Id is required");
        }
    }
}