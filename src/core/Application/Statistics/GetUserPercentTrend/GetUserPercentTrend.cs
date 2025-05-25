


using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetUserPercentTrend
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetUserPercentTrendQuery : IRequest<double>
    {
        public DateTime FirstStartDate { get; init; }
        public DateTime FirstEndDate { get; init; }
        public DateTime SecondStartDate { get; init; }
        public DateTime SecondEndDate { get; init; }
    }

    internal class GetUserPercentTrendQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetUserPercentTrendQuery, double>
    {
        public async Task<double> Handle(GetUserPercentTrendQuery request, CancellationToken cancellationToken)
        {
            var first = await context.Users.CountAsync(u => u.Created > request.FirstStartDate && u.Created <= request.FirstEndDate);
            if (first == 0) return 0;

            var second = await context.Users.CountAsync(u => u.Created > request.SecondStartDate && u.Created <= request.SecondEndDate);

            return (second - first) / (double)first;
        }
    }
}