


using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetPostPercentTrend
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetPostPercentTrendQuery : IRequest<double>
    {
        public DateTime FirstStartDate { get; init; }
        public DateTime FirstEndDate { get; init; }
        public DateTime SecondStartDate { get; init; }
        public DateTime SecondEndDate { get; init; }
    }

    internal class GetPostPercentTrendQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetPostPercentTrendQuery, double>
    {
        public async Task<double> Handle(GetPostPercentTrendQuery request, CancellationToken cancellationToken)
        {
            var first = await context.Posts.CountAsync(x => x.Created > request.FirstStartDate && x.Created <= request.FirstEndDate);
            if (first == 0) return 0;
            var second = await context.Posts.CountAsync(x => x.Created > request.SecondStartDate && x.Created <= request.SecondEndDate);
            return (second - first) / (double)first;
        }
    }
}