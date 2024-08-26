
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries.GetPostFeedWithPagination
{
    [Authorize]
    public record GetPostFeedWithPaginationQuery : IRequest<PaginatedList<PostDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    internal class GetPostFeedWithPaginationHandler : IRequestHandler<GetPostFeedWithPaginationQuery, PaginatedList<PostDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPostFeedWithPaginationHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedList<PostDto>> Handle(GetPostFeedWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Posts.AsSplitQuery().ProjectTo<PostDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(x => x.Created)
                .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}