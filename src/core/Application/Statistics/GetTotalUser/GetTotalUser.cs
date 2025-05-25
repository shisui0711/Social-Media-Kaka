


using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetTotalUser
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetTotalUserQuery : IRequest<int>
    {
    }

    internal class GetTotalUserQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetTotalUserQuery, int>
    {
        public async Task<int> Handle(GetTotalUserQuery request, CancellationToken cancellationToken)
        {
            return await context.Users.CountAsync();
        }
    }
}