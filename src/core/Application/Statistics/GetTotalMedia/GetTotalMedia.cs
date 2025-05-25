


using Application.Common.Interfaces;

namespace Application.Statistics.GetTotalMedia
{
    public record GetTotalMediaQuery : IRequest<int>
    {
    }

    internal class GetTotalMediaQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetTotalMediaQuery, int>
    {
        public async Task<int> Handle(GetTotalMediaQuery request, CancellationToken cancellationToken)
        {
            return await context.PostMedias.CountAsync(cancellationToken);
        }
    }
}