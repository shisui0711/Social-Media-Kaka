
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Posts.Queries.GetUserPostWithPagination
{
    public record GetUserPostWithPaginationQuery : IRequest<PaginatedList<PostDto>>
    {
        public string userId { get; set; } = null!;
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetUserPostWithPaginationHandler : IRequestHandler<GetUserPostWithPaginationQuery, PaginatedList<PostDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetUserPostWithPaginationHandler(IMapper mapper, IApplicationDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<PaginatedList<PostDto>> Handle(GetUserPostWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Posts.Where(p=>p.UserId == request.userId)
                    .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
                    .OrderByDescending(p => p.Created)
                    .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}