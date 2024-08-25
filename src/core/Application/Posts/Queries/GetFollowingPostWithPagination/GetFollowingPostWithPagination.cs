

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries.GetFollowingPostWithPagination
{
    [Authorize]
    public record GetFollowingPostWithPaginationQuery : IRequest<PaginatedList<PostDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    internal class GetFollowingPostWithPaginationHandler : IRequestHandler<GetFollowingPostWithPaginationQuery, PaginatedList<PostDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetFollowingPostWithPaginationHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostDto>> Handle(GetFollowingPostWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Posts
                    .Include(p => p.User)
                    .ThenInclude(u => u.Followers)
                    .Where(p => p.User.Followers.Any(f => f.FollowerId == _currentUser.Id))
                    .OrderByDescending(p => p.Created)
                    .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
                    .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}