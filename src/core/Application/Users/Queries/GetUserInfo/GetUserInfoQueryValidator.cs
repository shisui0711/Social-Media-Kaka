

namespace Application.Users.Queries.GetUserInfo
{
    public class GetUserInfoQueryValidator : AbstractValidator<GetUserInfoQuery>
    {
        public GetUserInfoQueryValidator()
        {
            RuleFor(x=>x.UserName).NotEmpty().WithMessage("Username is required");
        }
    }
}