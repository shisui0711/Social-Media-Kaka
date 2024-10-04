

namespace Application.Conversations.Commands.AddUserToConversation
{
    public class AddUserToConversationCommandValidator : AbstractValidator<AddUserToConversationCommand>
    {
        public AddUserToConversationCommandValidator()
        {
            RuleFor(x=>x.ConversationId).NotEmpty().WithMessage("ConversationId is required");
            RuleFor(x=>x.UserId).NotEmpty().WithMessage("UserId is required");
        }
    }
}