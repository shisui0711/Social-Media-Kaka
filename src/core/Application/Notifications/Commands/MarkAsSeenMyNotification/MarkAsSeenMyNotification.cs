

using Application.Common.Interfaces;

namespace Application.Notifications.Commands.MarkAsSeenMyNotification
{
    public record MarkAsSeenMyNotificationCommand : IRequest
    {
        public string notificationId { get; set; } = null!;
    }

    internal class MarkAsSeenMyNotificationCommandHandler : IRequestHandler<MarkAsSeenMyNotificationCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        public MarkAsSeenMyNotificationCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(MarkAsSeenMyNotificationCommand request, CancellationToken cancellationToken)
        {
            await _context.Notifications.Where(x=>x.Id == request.notificationId && x.RecipientId == _currentUser.Id).ForEachAsync(x => x.Seen = true);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}