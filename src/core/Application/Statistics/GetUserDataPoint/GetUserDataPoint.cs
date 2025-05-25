

using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetUserDataPoint
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetUserDataPointQuery : IRequest<IEnumerable<KeyValuePair<DateTime, int>>>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    internal class GetUserDataPointQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetUserDataPointQuery, IEnumerable<KeyValuePair<DateTime, int>>>
    {
        public async Task<IEnumerable<KeyValuePair<DateTime, int>>> Handle(GetUserDataPointQuery request, CancellationToken cancellationToken)
        {
            var statsByDay = await context.Users
            .Where(u => u.Created > request.StartDate && u.Created < request.EndDate)
            .GroupBy(u => u.Created.Date)
            .Select(g => new
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync(cancellationToken);

            return statsByDay
                .Select(x => new KeyValuePair<DateTime, int>(x.Date, x.Count))
                .ToList();
        }
    }
}