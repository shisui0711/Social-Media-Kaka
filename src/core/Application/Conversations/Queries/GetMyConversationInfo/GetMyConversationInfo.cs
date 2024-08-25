

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Conversations.Queries.GetMyConversationInfo
{
    [Authorize]
    public record GetMyConversationInfoQuery : IRequest<ConversationDto>
    {
        public string ConversationId { get; set; } = null!;
    }

    internal class GetMyConversationInfoQueryHandler : IRequestHandler<GetMyConversationInfoQuery, ConversationDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetMyConversationInfoQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ConversationDto> Handle(GetMyConversationInfoQuery request, CancellationToken cancellationToken)
        {
            var conversation = await _context.Conversations.Where(x => x.Id == request.ConversationId)
            .ProjectTo<ConversationDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.ConversationId, conversation);
            return conversation;
        }
    }
}