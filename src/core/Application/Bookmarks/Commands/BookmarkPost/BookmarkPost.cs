
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Bookmarks.Commands.BookmarkPost
{
    [Authorize]
    public record BookmarkPostCommand : IRequest
    {
        public string PostId { get; set; } = null!;
    }

    internal class BookmarkPostCommandHandler : IRequestHandler<BookmarkPostCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public BookmarkPostCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(BookmarkPostCommand request, CancellationToken cancellationToken)
        {
            var post = await _context.Posts.FindAsync(request.PostId);
            Guard.Against.NotFound(request.PostId, post);

            var bookmark = await _context.Bookmarks.Where(x => x.UserId == _currentUser.Id && x.PostId == post.Id).FirstOrDefaultAsync();
            if (bookmark == null)
            {
                await _context.Bookmarks.AddAsync(new Bookmark
                {
                    UserId = _currentUser.Id!,
                    PostId = post.Id
                });
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}