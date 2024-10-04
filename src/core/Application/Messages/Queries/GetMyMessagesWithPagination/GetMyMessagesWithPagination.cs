using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Messages.Queries.GetMyMessagesWithPagination
{
    [Authorize]
    public record GetMyMessagesWithPaginationQuery : IRequest<PaginatedList<MessageDto>>
    {
        public string ConversationId { get; set; } = null!;
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetMyMessagesWithPaginationQueryHandler : IRequestHandler<GetMyMessagesWithPaginationQuery, PaginatedList<MessageDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetMyMessagesWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<MessageDto>> Handle(GetMyMessagesWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Messages
                .AsNoTracking()
                .Where(x => x.ConversationId == request.ConversationId)
                .AsSplitQuery()
                .Include(x => x.Conversation).ThenInclude(x => x.ConversationMembers)
                .Where(m => m.Conversation.ConversationMembers.Any(cm => cm.UserId == _currentUser.Id))
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .OrderBy(m => m.Created)
                .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}