

namespace Application.Conversations.Commands.EnsureCreatedConversation
{
    public class EnsureCreatedConversationCommandValidator : AbstractValidator<EnsureCreatedConversationCommand>
    {
        public EnsureCreatedConversationCommandValidator()
        {
            RuleFor(x=>x.ReceiverId).NotEmpty().WithMessage("ReceiverId is required");
        }
    }
}