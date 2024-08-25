

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Bookmarks.Queries.GetBookmarkInfo
{
    [Authorize]

    public record GetBookmarkInfoQuery : IRequest<BookmarkInfo>
    {
        public string PostId { get; set; } = null!;
    }

    internal class GetBookmarkInfoQueryHandler : IRequestHandler<GetBookmarkInfoQuery, BookmarkInfo>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public GetBookmarkInfoQueryHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public Task<BookmarkInfo> Handle(GetBookmarkInfoQuery request, CancellationToken cancellationToken)
        {
            return Task.FromResult(new BookmarkInfo {
                isBookmarkedByUser = _context.Bookmarks
                .Count(x => x.PostId == request.PostId && x.UserId == _currentUser.Id) > 0
            });
        }
    }
}