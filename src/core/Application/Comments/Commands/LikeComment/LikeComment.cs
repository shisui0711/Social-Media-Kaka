

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Comments.Commands.LikeComment
{

    [Authorize]
    public record LikeCommentCommand : IRequest
    {
        public string CommentId { get; set; } = null!;
    }

    internal class LikeCommentCommandHandler : IRequestHandler<LikeCommentCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public LikeCommentCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(LikeCommentCommand request, CancellationToken cancellationToken)
        {

            var comment = await _context.Comments
            .Where(p => p.Id == request.CommentId)
            .Select(p => new { p.UserId })
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.CommentId,comment);

            await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Upsert Like
                var existingLike = await _context.CommentLikes
                    .FirstOrDefaultAsync(l => l.UserId == _currentUser.Id && l.CommentId == request.CommentId);

                if (existingLike == null)
                {
                    var newLike = new CommentLike
                    {
                        UserId = _currentUser.Id!,
                        CommentId = request.CommentId
                    };
                    _context.CommentLikes.Add(newLike);
                }

                // 2. Create Notification (conditionally)
                if (_currentUser.Id != comment.UserId)
                {
                    var notification = new Notification
                    {
                        IssuerId = _currentUser.Id,
                        RecipientId = comment.UserId,
                        CommentId = request.CommentId,
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