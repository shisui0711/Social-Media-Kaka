


using Application.Common.Interfaces;

namespace Application.Conversations.Commands.EditTitleConversation
{
    public record EditTitleConversationCommand : IRequest
    {
        public string ConversationId { get; init; } = null!;
        public string Title { get; init; } = null!;
    }

    internal class EditTitleConversationCommandHandler(
        IApplicationDbContext context
    ) : IRequestHandler<EditTitleConversationCommand>
    {
        public async Task Handle(EditTitleConversationCommand request, CancellationToken cancellationToken)
        {
            var conversation = await context.Conversations.FindAsync(request.ConversationId);
            Guard.Against.NotFound(request.ConversationId, conversation);
            conversation.Title = request.Title;
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}