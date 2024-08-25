
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Notifications.Queries.GetMyNotificationWithPagination
{
    [Authorize]
    public record GetMyNotifcationWithPaginationQuery : IRequest<PaginatedList<NotificationDto>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetMyNotifcationWithPaginationHandler : IRequestHandler<GetMyNotifcationWithPaginationQuery, PaginatedList<NotificationDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetMyNotifcationWithPaginationHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<NotificationDto>> Handle(GetMyNotifcationWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Notifications.Where(x=>x.RecipientId == _currentUser.Id)
                    .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                    .OrderByDescending(x=>x.Created)
                    .PaginatedListAsync(request.PageNumber,request.PageSize);
        }
    }
}