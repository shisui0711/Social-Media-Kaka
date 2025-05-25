

using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetTotalPost
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetTotalPostQuery : IRequest<int>
    {

    }

    internal class GetTotalPostQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetTotalPostQuery, int>
    {
        public async Task<int> Handle(GetTotalPostQuery request, CancellationToken cancellationToken)
        {
            return await context.Posts.CountAsync();
        }
    }
}