

using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Statistics.GetPostDataPoint
{
    [Authorize(Roles = Roles.Administrator)]
    public record GetPostDataPointQuery : IRequest<IEnumerable<KeyValuePair<DateTime, int>>>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    internal class GetPostDataPointQueryHandler(
        IApplicationDbContext context
    ) : IRequestHandler<GetPostDataPointQuery, IEnumerable<KeyValuePair<DateTime, int>>>
    {
        public async Task<IEnumerable<KeyValuePair<DateTime, int>>> Handle(GetPostDataPointQuery request, CancellationToken cancellationToken)
        {
            var statsByDay = await context.Posts
            .Where(p => p.Created > request.StartDate && p.Created < request.EndDate)
            .GroupBy(p => p.Created.Date)
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