

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Conversations.Commands.RemoveConversation
{
    [Authorize]
    public record RemoveConversationCommand : IRequest<ConversationDto>
    {
        public string ConversationId { get; set; } = null!;
    }

    internal class RemoveConversationCommandHandler : IRequestHandler<RemoveConversationCommand, ConversationDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public RemoveConversationCommandHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<ConversationDto> Handle(RemoveConversationCommand request, CancellationToken cancellationToken)
        {
            var deletedConversation = await _context.Conversations.Where(x => x.Id == request.ConversationId)
            .Include(x => x.ConversationMembers)
            .Where(x => x.ConversationMembers.Any(x => x.UserId == _currentUser.Id)).FirstOrDefaultAsync();
            Guard.Against.NotFound(request.ConversationId, deletedConversation);
            _context.Conversations.Remove(deletedConversation);
            await _context.SaveChangesAsync(cancellationToken);
            return _mapper.Map<ConversationDto>(deletedConversation);
        }
    }
}