

namespace Application.Comments.Commands.CreateNestedComment
{
    public class CreateNestedCommentCommandValidator : AbstractValidator<CreateNestedCommentCommand>
    {
        public CreateNestedCommentCommandValidator()
        {
            RuleFor(x=>x.CommentId).NotEmpty().WithMessage("CommentId is required");
            RuleFor(x => x.Content).NotEmpty().WithMessage("Content is required");
        }
    }
}