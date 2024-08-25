

namespace Application.Users.Queries.GetFriendInfo
{
    public class GetFriendInfoQueryValidator : AbstractValidator<GetFriendInfoQuery>
    {
        public GetFriendInfoQueryValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("UserId is required");
        }
    }
}