

using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Users.Commands.UnFollowUser
{
    [Authorize]
    public record UnFollowUserCommand : IRequest
    {
        public string UserId { get; set; } = null!;
    }

    internal class UnFollowUserCommandHandler : IRequestHandler<UnFollowUserCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public UnFollowUserCommandHandler(IUser currentUser, IApplicationDbContext context)
        {
            _currentUser = currentUser;
            _context = context;
        }

        public async Task Handle(UnFollowUserCommand request, CancellationToken cancellationToken)
        {
            await _context.Database.BeginTransactionAsync();

            try
            {
                var follows = _context.Follows.Where(x => x.FollowerId == _currentUser.Id && x.FollowingId == request.UserId);
                _context.Follows.RemoveRange(follows);

                var notifications =
                    _context.Notifications.Where(x => x.IssuerId == _currentUser.Id
                    && x.RecipientId == request.UserId && x.Type == "FOLLOW");
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