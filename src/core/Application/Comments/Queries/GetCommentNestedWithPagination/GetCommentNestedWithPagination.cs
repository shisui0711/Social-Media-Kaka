

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Comments.Queries.GetCommentNestedWithPagination
{
    public record GetCommentNestedWithPaginationQuery : IRequest<PaginatedList<CommentDto>>
    {
        public string CommentId { get; set; } = null!;
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetCommentNestedWithPaginationQueryHandler : IRequestHandler<GetCommentNestedWithPaginationQuery, PaginatedList<CommentDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCommentNestedWithPaginationQueryHandler(IMapper mapper, IApplicationDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<PaginatedList<CommentDto>> Handle(GetCommentNestedWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Comments.Where(x=>x.ParentId == request.CommentId)
            .OrderByDescending(x=>x.Created)
            .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}