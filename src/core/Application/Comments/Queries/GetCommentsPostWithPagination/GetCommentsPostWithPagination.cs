

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Comments.Queries.GetCommentsPostWithPagination
{
    public record GetCommentsPostWithPaginationQuery : IRequest<PaginatedList<CommentDto>>
    {
        public string PostId { get; set; } = null!;
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetCommentsPostWithPaginationQueryHandler : IRequestHandler<GetCommentsPostWithPaginationQuery, PaginatedList<CommentDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCommentsPostWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedList<CommentDto>> Handle(GetCommentsPostWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Comments.Where(x=>x.PostId == request.PostId && x.ParentId == null)
            .OrderByDescending(x=>x.Created)
            .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}