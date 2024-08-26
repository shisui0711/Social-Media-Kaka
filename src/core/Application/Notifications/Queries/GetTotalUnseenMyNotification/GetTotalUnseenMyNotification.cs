

using Application.Common.Interfaces;

namespace Application.Notifications.Queries.GetTotalUnseenMyNotification
{
    public class GetTotalUnseenMyNotificationQuery : IRequest<int>;
    internal class GetTotalUnseenMyNotificationQueryHandler : IRequestHandler<GetTotalUnseenMyNotificationQuery, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public GetTotalUnseenMyNotificationQueryHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public Task<int> Handle(GetTotalUnseenMyNotificationQuery request, CancellationToken cancellationToken)
        {
            return _context.Notifications.AsNoTracking()
            .AsSplitQuery()
            .CountAsync(x=>x.RecipientId == _currentUser.Id && x.Seen == false);
        }
    }
}