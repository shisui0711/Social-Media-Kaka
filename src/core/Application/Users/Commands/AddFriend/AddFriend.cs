
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Constants;
using Domain.Entities;

namespace Application.Users.Commands.AddFriend
{
    [Authorize]
    public record AddFriendCommand : IRequest
    {
        public string UserId { get; set; } = null!;
    }

    internal class AddFriendCommandHandler : IRequestHandler<AddFriendCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public AddFriendCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(AddFriendCommand request, CancellationToken cancellationToken)
        {
            if(_currentUser.Id == request.UserId) return;
            await _context.Database.BeginTransactionAsync();

            var user = await _context.Users.FindAsync(request.UserId);
            Guard.Against.NotFound(request.UserId,user);

            try
            {
                var exist = await _context.FriendRelations
                    .FirstOrDefaultAsync(l =>
                    (l.SenderId == _currentUser.Id && l.ReceiverId == request.UserId) ||
                    (l.SenderId == request.UserId && l.ReceiverId == _currentUser.Id));

                if (exist == null)
                {
                    var newFriend = new FriendRelation()
                    {
                        SenderId = _currentUser.Id!,
                        ReceiverId = request.UserId
                    };
                    _context.FriendRelations.Add(newFriend);
                    await _context.Notifications.AddAsync(new Notification
                    {
                        IssuerId = _currentUser.Id,
                        RecipientId = request.UserId,
                        Type = NotificationTypes.ADDFRIEND
                    });
                }else
                {
                    exist.Accepted = true;
                    await _context.Notifications.AddAsync(new Notification
                    {
                        IssuerId = _currentUser.Id,
                        RecipientId = request.UserId,
                        Type = NotificationTypes.ACCEPTFRIEND
                    });
                }

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