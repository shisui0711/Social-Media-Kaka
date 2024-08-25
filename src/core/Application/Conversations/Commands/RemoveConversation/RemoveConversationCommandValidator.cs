

namespace Application.Conversations.Commands.RemoveConversation
{
    public class RemoveConversationCommandValidator : AbstractValidator<RemoveConversationCommand>
    {
        public RemoveConversationCommandValidator()
        {
            RuleFor(x=>x.ConversationId).NotEmpty().WithMessage("ConversationId is required");
        }
    }
}