
namespace Application.Users.Queries.GetUserInfoById
{
    public class GetUserInfoByIdQueryValidator : AbstractValidator<GetUserInfoByIdQuery>
    {
        public GetUserInfoByIdQueryValidator()
        {
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("User Id is required");
        }
    }
}