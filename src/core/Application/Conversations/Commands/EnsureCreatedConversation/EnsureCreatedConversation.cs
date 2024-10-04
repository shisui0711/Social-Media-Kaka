using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Conversations.Commands.EnsureCreatedConversation
{
    [Authorize]
    public record EnsureCreatedConversationCommand : IRequest<ConversationDto>
    {
        public string ReceiverId { get; set; } = null!;
    }

    internal class EnsureCreatedConversationHandler : IRequestHandler<EnsureCreatedConversationCommand, ConversationDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public EnsureCreatedConversationHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<ConversationDto> Handle(EnsureCreatedConversationCommand request, CancellationToken cancellationToken)
        {

            await _context.Database.BeginTransactionAsync();
            try
            {
                var conversation = await _context.Conversations.ProjectTo<ConversationDto>(_mapper.ConfigurationProvider)
                    .Where(x => x.ConversationMembers.Count == 2 && x.ConversationMembers
                    .Any(c => c.UserId == request.ReceiverId) && x.ConversationMembers.Any(x => x.UserId == _currentUser.Id))
                    .FirstOrDefaultAsync();
                if (conversation == null)
                {
                    var newConversation = new Conversation();
                    await _context.Conversations.AddAsync(newConversation);
                    await _context.ConversationMembers.AddAsync(new Domain.Entities.ConversationMember
                    {
                        ConversationId = newConversation.Id,
                        UserId = _currentUser.Id!
                    });
                    await _context.ConversationMembers.AddAsync(new Domain.Entities.ConversationMember
                    {
                        ConversationId = newConversation.Id,
                        UserId = request.ReceiverId
                    });
                    await _context.SaveChangesAsync(cancellationToken);
                    await _context.Database.CommitTransactionAsync();
                    return await _context.Conversations.Where(x => x.Id == newConversation.Id)
                    .ProjectTo<ConversationDto>(_mapper.ConfigurationProvider)
                    .FirstAsync();
                }

                return conversation;
            }
            catch (Exception)
            {
                await _context.Database.RollbackTransactionAsync();
                throw;
            }
        }
    }
}