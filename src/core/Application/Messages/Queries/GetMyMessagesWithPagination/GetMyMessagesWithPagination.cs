

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
            var res = _context.Messages.Include(x=>x.Conversation).ThenInclude(x=>x.ConversationMembers)
                .Where(m => m.ConversationId == request.ConversationId &&
                m.Conversation.ConversationMembers.Any(cm => cm.UserId == _currentUser.Id));
            return  await  res.ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .OrderBy(m => m.Created)
                .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}