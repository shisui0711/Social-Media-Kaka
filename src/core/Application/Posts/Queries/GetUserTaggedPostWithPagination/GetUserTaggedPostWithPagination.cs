

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries.GetUserTaggedPostWithPagination
{
    [Authorize]
    public record GetUserTaggedPostWithPaginationQuery : IRequest<PaginatedList<PostDto>>
    {
        public string UserName { get; set; } = null!;
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
    }

    internal class GetUserTaggedPostWithPaginationHandler : IRequestHandler<GetUserTaggedPostWithPaginationQuery, PaginatedList<PostDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetUserTaggedPostWithPaginationHandler(IMapper mapper, IApplicationDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<PaginatedList<PostDto>> Handle(GetUserTaggedPostWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Posts.Where(x => x.Content.Contains($"@{request.UserName}"))
            .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
            .OrderByDescending(x => x.Created)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}