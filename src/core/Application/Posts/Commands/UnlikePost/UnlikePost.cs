

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Posts.Commands.UnlikePost
{
    [Authorize]
    public record UnlikePostCommand : IRequest
    {
        public string PostId { get; set; } = null!;
    }

    internal class UnlikePostCommandHandler : IRequestHandler<UnlikePostCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public UnlikePostCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UnlikePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _context.Posts
            .Where(p => p.Id == request.PostId)
            .Select(p => new { p.UserId })
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.PostId,post);

            await _context.Database.BeginTransactionAsync();
            try
            {
                var likes = _context.Likes.Where(x => x.UserId == _currentUser.Id && x.PostId == request.PostId);
                _context.Likes.RemoveRange(likes);

                var notifications = _context.Notifications.Where(x =>
                    x.IssuerId == _currentUser.Id && x.PostId == post.UserId && x.RecipientId == post.UserId && x.Type == "LIKE");
                _context.Notifications.RemoveRange(notifications);
                await _context.SaveChangesAsync(default);
                await _context.Database.CommitTransactionAsync();
            }
            catch (Exception)
            {
                await _context.Database.RollbackTransactionAsync();
                throw;
            }
        }
    }
}