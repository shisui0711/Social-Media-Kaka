

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Posts.Commands.LikePost
{
    [Authorize]
    public record LikePostCommand : IRequest
    {
        public string PostId { get; set; } = null!;
    }

    internal class LikePostCommandHandler : IRequestHandler<LikePostCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public LikePostCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(LikePostCommand request, CancellationToken cancellationToken)
        {

            var post = await _context.Posts
            .Where(p => p.Id == request.PostId)
            .Select(p => new { p.UserId })
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.PostId,post);

            await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Upsert Like
                var existingLike = await _context.Likes
                    .FirstOrDefaultAsync(l => l.UserId == _currentUser.Id && l.PostId == request.PostId);

                if (existingLike == null)
                {
                    var newLike = new Like
                    {
                        UserId = _currentUser.Id!,
                        PostId = request.PostId
                    };
                    _context.Likes.Add(newLike);
                }

                // 2. Create Notification (conditionally)
                if (_currentUser.Id != post.UserId)
                {
                    var notification = new Notification
                    {
                        IssuerId = _currentUser.Id,
                        RecipientId = post.UserId,
                        PostId = request.PostId,
                        Type = "LIKE"
                    };
                    _context.Notifications.Add(notification);
                }

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