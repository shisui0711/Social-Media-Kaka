

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Bookmarks.Commands.UnBookmarkPost
{
    [Authorize]
    public record UnBookmarkPostCommand : IRequest
    {
        public string PostId { get; set; } = null!;
    }

    internal class UnBookmarkPostCommandHandler : IRequestHandler<UnBookmarkPostCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public UnBookmarkPostCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UnBookmarkPostCommand request, CancellationToken cancellationToken)
        {
            var post = await _context.Posts.FindAsync(request.PostId);
            Guard.Against.NotFound(request.PostId,post);
            var bookmark = _context.Bookmarks.Where(x => x.UserId == _currentUser.Id && x.PostId == post.Id);
            _context.Bookmarks.RemoveRange(bookmark);
            await _context.SaveChangesAsync(default);
        }
    }
}