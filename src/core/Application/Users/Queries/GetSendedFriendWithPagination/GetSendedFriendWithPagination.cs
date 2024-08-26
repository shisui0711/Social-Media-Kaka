
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Users.Queries.GetSendedFriendWithPagination
{
    public record GetSendedFriendWithPaginationQuery : IRequest<PaginatedList<UserDto>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetSendedFriendWithPaginationQueryHandler : IRequestHandler<GetSendedFriendWithPaginationQuery, PaginatedList<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        private readonly IMapper _mapper;

        public GetSendedFriendWithPaginationQueryHandler(IMapper mapper, IUser currentUser, IApplicationDbContext context)
        {
            _mapper = mapper;
            _currentUser = currentUser;
            _context = context;
        }

        public Task<PaginatedList<UserDto>> Handle(GetSendedFriendWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return _context.Users.AsSplitQuery().ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .Where(x=>
                        x.FriendRelationReceivers.Any(o=>o.SenderId == _currentUser.Id && !o.Accepted)
                    ).PaginatedListAsync(request.PageNumber,request.PageSize);
        }
    }
}