

using Application.Common.Interfaces;

namespace Application.Statistics.GetTotalConversation
{
    public record GetTotalConversationQuery : IRequest<int>
    {
    }

    internal class GetTotalConversationQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetTotalConversationQuery, int>
    {
        public async Task<int> Handle(GetTotalConversationQuery request, CancellationToken cancellationToken)
        {
            return await context.Conversations.CountAsync(cancellationToken);
        }
    }
}