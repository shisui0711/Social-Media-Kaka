


using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Conversations.Commands.AddUserToConversation
{
    public record AddUserToConversationCommand : IRequest
    {
        public string ConversationId { get; set; } = null!;
        public string UserId { get; set; } = null!;
    }

    internal class AddUserToConversationCommandHandler(
        IApplicationDbContext _context
    ) : IRequestHandler<AddUserToConversationCommand>
    {

        public async Task Handle(AddUserToConversationCommand request, CancellationToken cancellationToken)
        {
            var conversation = await _context.Conversations.AsNoTracking()
            .Include(x => x.ConversationMembers).ThenInclude(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == request.ConversationId);
            if (conversation == null) Guard.Against.NotFound(request.ConversationId, conversation);
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) Guard.Against.NotFound(request.UserId, user);
            conversation.ConversationMembers.Add(new ConversationMember
            {
                ConversationId = conversation.Id,
                UserId = user.Id,
            });
            if (conversation.ConversationMembers.Count > 2)
            {
                conversation.Title = string.Join(",", conversation.ConversationMembers.Select(x => x.User.DisplayName));
            }
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}