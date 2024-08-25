

using Application.Common.Exceptions;
using Application.Common.Interfaces;

namespace Application.Comments.Commands.UnlikeComment
{
    public record UnlikeCommentCommand : IRequest
    {
        public string CommentId { get; set; } = null!;
    }

    internal class UnlikeCommentCommandHandler : IRequestHandler<UnlikeCommentCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public UnlikeCommentCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UnlikeCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments
            .Where(p => p.Id == request.CommentId)
            .Select(p => new { p.UserId })
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.CommentId,comment);

            await _context.Database.BeginTransactionAsync();
            try
            {
                var likes = _context.CommentLikes.Where(x => x.UserId == _currentUser.Id && x.CommentId == request.CommentId);
                _context.CommentLikes.RemoveRange(likes);

                var notifications = _context.Notifications.Where(x =>
                    x.IssuerId == _currentUser.Id && x.CommentId == comment.UserId
                    && x.RecipientId == comment.UserId && x.Type == "LIKE");
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