

using Application.Common.Interfaces;

namespace Application.Notifications.Commands.MarkAsSeenMyNotifications
{
    public record MarkAsSeenMyNotificationsCommand : IRequest;

    internal class MarkAsSeenMyNotificationsCommandHandler : IRequestHandler<MarkAsSeenMyNotificationsCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        public MarkAsSeenMyNotificationsCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(MarkAsSeenMyNotificationsCommand request, CancellationToken cancellationToken)
        {
            await _context.Notifications.Where(x => x.RecipientId == _currentUser.Id).ForEachAsync(x => x.Seen = true);
        }
    }
}