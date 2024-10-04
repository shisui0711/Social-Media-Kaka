

namespace Application.Messages.Commands.CreateMessage
{
    public class CreateMessageCommandValidator : AbstractValidator<CreateMessageCommand>
    {
        public CreateMessageCommandValidator()
        {
            RuleFor(x => x.ConversationId).NotEmpty().WithMessage("ConversationId is required");
            RuleFor(x => x.Content).NotEmpty().WithMessage("Content is required");
            RuleFor(x => x.SenderId).NotEmpty().WithMessage("SenderId is required");
        }
    }
}