

namespace Application.Comments.Commands.RemoveComment
{
    public class RemoveCommentCommandValidator : AbstractValidator<RemoveCommentCommand>
    {
        public RemoveCommentCommandValidator()
        {
            RuleFor(x=>x.CommentId).NotEmpty().WithMessage("CommentId is required");
        }
    }
}