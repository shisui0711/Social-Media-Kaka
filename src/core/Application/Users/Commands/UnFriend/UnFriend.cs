


using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Users.Commands.UnFriend
{
    [Authorize]
    public record UnFriendCommand : IRequest
    {
        public string UserId { get; set; } = null!;
    }

    internal class UnFriendCommandHandler : IRequestHandler<UnFriendCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public UnFriendCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UnFriendCommand request, CancellationToken cancellationToken)
        {
            await _context.Database.BeginTransactionAsync();

            try
            {
                var friend = await _context.FriendRelations
                    .FirstOrDefaultAsync(l =>
                    (l.SenderId == _currentUser.Id && l.ReceiverId == request.UserId) ||
                    (l.SenderId == request.UserId && l.ReceiverId == _currentUser.Id));
                Guard.Against.NotFound(request.UserId,friend);
                _context.FriendRelations.Remove(friend);

                var notifications =
                    _context.Notifications.Where(x => x.IssuerId == _currentUser.Id
                    && x.RecipientId == request.UserId &&
                    (x.Type == NotificationTypes.ADDFRIEND || x.Type == NotificationTypes.ACCEPTFRIEND));
                _context.Notifications.RemoveRange(notifications);

                await _context.SaveChangesAsync(cancellationToken);
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