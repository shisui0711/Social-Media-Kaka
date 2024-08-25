
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries
{
    [Authorize]
    public record GetTrendingTagQuery : IRequest<IEnumerable<TrendingTag>>;

    internal class GetTrendingTagQueryHandler : IRequestHandler<GetTrendingTagQuery, IEnumerable<TrendingTag>>
    {
        private readonly IApplicationDbContext _context;

        public GetTrendingTagQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TrendingTag>> Handle(GetTrendingTagQuery request, CancellationToken cancellationToken)
        {
            return await _context.Database.SqlQueryRaw<TrendingTag>(
            "SELECT Tag[1], COUNT(*) as Count FROM (SELECT regexp_matches(content, '#\\w+', 'g') as Tag FROM posts) as Tag GROUP BY Tag ORDER BY Count DESC, Tag ASC LIMIT 5;")
            .ToArrayAsync();
        }
    }
}