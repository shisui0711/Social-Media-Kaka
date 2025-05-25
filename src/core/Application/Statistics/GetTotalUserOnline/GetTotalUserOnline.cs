

using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetTotalUserOnline
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetTotalUserOnlineQuery: IRequest<int>
    {
    }

    internal class GetTotalUserOnlineQueryHandler(
    ) : IRequestHandler<GetTotalUserOnlineQuery, int>
    {
        public Task<int> Handle(GetTotalUserOnlineQuery request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}