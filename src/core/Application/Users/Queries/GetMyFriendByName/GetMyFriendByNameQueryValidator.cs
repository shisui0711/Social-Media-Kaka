

namespace Application.Users.Queries.GetMyFriendByName
{
    public class GetMyFriendByNameQueryValidator : AbstractValidator<GetMyFriendByNameQuery>
    {
        public GetMyFriendByNameQueryValidator()
        {
            RuleFor(x=>x.Name).NotNull().WithMessage("Name is required");
        }
    }
}