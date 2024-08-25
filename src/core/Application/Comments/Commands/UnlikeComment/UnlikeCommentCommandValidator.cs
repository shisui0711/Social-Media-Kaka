

namespace Application.Comments.Commands.UnlikeComment
{
    public class UnlikeCommentCommandValidator : AbstractValidator<UnlikeCommentCommand>
    {
        public UnlikeCommentCommandValidator()
        {
            RuleFor(x=>x.CommentId).NotEmpty().WithMessage("CommentId is required");
        }
    }
}