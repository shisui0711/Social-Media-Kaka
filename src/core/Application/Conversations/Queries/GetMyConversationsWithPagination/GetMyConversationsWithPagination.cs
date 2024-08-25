

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Conversations.Queries.GetMyConversationsWithPagination
{
    [Authorize]
    public record GetMyConversationsWithPaginationQuery : IRequest<PaginatedList<ConversationDto>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetMyConversationsWithPaginationQueryHandler
    : IRequestHandler<GetMyConversationsWithPaginationQuery, PaginatedList<ConversationDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetMyConversationsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<ConversationDto>> Handle(GetMyConversationsWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.ConversationMembers
                .Where(x => x.UserId == _currentUser.Id)
                .AsSplitQuery()
                .Include(x => x.Conversation)
                .ThenInclude(c => c.Messages.OrderByDescending(m => m.Created).Take(1)) // Chỉ lấy tin nhắn cuối cùng
                .Where(x => x.Conversation.Messages.Any()) // Đảm bảo chỉ lấy các cuộc hội thoại có tin nhắn
                .Select(x => x.Conversation)
                .ProjectTo<ConversationDto>(_mapper.ConfigurationProvider)
                .Select(x => new
                {
                    Conversation = x,
                    LastMessageTime = x.Messages.Max(m => m.Created) // Lấy thời gian của tin nhắn cuối cùng
                })
                .OrderByDescending(x => x.LastMessageTime)
                .Select(x => x.Conversation)
                .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}