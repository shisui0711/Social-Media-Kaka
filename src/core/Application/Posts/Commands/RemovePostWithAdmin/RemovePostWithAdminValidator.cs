
namespace Application.Posts.Commands.RemovePostWithAdmin
{
    public class RemovePostWithAdminValidator : AbstractValidator<RemovePostWithAdminCommand>
    {
        public RemovePostWithAdminValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
        }
    }
}