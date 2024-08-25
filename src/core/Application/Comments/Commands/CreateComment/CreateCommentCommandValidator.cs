

namespace Application.Comments.Commands.CreateComment
{
    public class CreateCommentCommandValidator : AbstractValidator<CreateCommentCommand>
    {
        public CreateCommentCommandValidator()
        {
            RuleFor(x=>x.PostId).NotEmpty().WithMessage("PostId is required");
            RuleFor(x => x.Content).NotEmpty().WithMessage("Content is required");
        }
    }
}