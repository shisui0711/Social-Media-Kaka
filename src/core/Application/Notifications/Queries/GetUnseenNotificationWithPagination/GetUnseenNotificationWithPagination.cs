
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Notifications.Queries.GetUnseenNotificationWithPagination
{
    public record GetUnseenNotificationWithPaginationQuery : IRequest<PaginatedList<NotificationDto>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetUnseenNotificationWithPaginationHandler : IRequestHandler<GetUnseenNotificationWithPaginationQuery, PaginatedList<NotificationDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetUnseenNotificationWithPaginationHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<NotificationDto>> Handle(GetUnseenNotificationWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Notifications.AsNoTracking()
                    .Where(x=>x.RecipientId == _currentUser.Id && x.Seen == false)
                    .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                    .OrderByDescending(x=>x.Created)
                    .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}