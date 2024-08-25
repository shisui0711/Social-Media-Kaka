

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries.GetBookmarkPostWithPagination
{
    [Authorize]
    public record GetBookmarkPostWithPaginationQuery : IRequest<PaginatedList<PostDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    internal class GetBookmarkPostWithPaginationHandler : IRequestHandler<GetBookmarkPostWithPaginationQuery, PaginatedList<PostDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetBookmarkPostWithPaginationHandler(IMapper mapper, IApplicationDbContext context, IUser currentUser)
        {
            _mapper = mapper;
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostDto>> Handle(GetBookmarkPostWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Bookmarks.Where(b => b.UserId == _currentUser.Id)
                    .OrderByDescending(b => b.Created)
                    .Select(b => b.Post)
                    .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
                    .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}