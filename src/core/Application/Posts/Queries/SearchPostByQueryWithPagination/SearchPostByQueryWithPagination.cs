

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Posts.Queries.SearchPostByQueryWithPagination
{
    public record SearchPostByQueryWithPaginationQuery : IRequest<PaginatedList<PostDto>>
    {
        public string q { get; set; } = null!;
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class SearchPostByQueryWithPaginationQueryHandler : IRequestHandler<SearchPostByQueryWithPaginationQuery,PaginatedList<PostDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SearchPostByQueryWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedList<PostDto>> Handle
        (SearchPostByQueryWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Posts.Where(x => x.Content.Contains(request.q))
            .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
            .OrderByDescending(x => x.Created)
            .PaginatedListAsync(request.PageNumber,request.PageSize);
        }
    }
}