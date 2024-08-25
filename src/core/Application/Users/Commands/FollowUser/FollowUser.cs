
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Users.Commands.FollowUser
{
    [Authorize]
    public record FollowUserCommand : IRequest
    {
        public string UserId { get; set; } = null!;
    }

    internal class FollowUserCommandHandler : IRequestHandler<FollowUserCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public FollowUserCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(FollowUserCommand request, CancellationToken cancellationToken)
        {

            if(_currentUser.Id == request.UserId) return;
            await _context.Database.BeginTransactionAsync();

            var user = await _context.Users.FindAsync(request.UserId);
            Guard.Against.NotFound(request.UserId,user);

            try
            {
                var exist = await _context.Follows
                    .FirstOrDefaultAsync(l => l.FollowingId == _currentUser.Id && l.FollowerId == _currentUser.Id);

                if (exist == null)
                {
                    var newFollow = new Follow()
                    {
                        FollowerId = _currentUser.Id!,
                        FollowingId = request.UserId
                    };
                    _context.Follows.Add(newFollow);
                }

                await _context.Notifications.AddAsync(new Notification
                {
                    IssuerId = _currentUser.Id,
                    RecipientId = request.UserId,
                    Type = "FOLLOW"
                });

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