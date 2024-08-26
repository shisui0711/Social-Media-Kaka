
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Users.Queries.GetMyFriendsWithPagination
{
    public record GetMyFriendsWithPaginationQuery : IRequest<PaginatedList<UserDto>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetMyFriendsWithPaginationQueryHandler : IRequestHandler<GetMyFriendsWithPaginationQuery, PaginatedList<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        private readonly IMapper _mapper;

        public GetMyFriendsWithPaginationQueryHandler(IApplicationDbContext context, IUser currentUser, IMapper mapper)
        {
            _context = context;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public Task<PaginatedList<UserDto>> Handle(GetMyFriendsWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return _context.Users.AsSplitQuery().ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .Where
                    (x=>
                        x.FriendRelationReceivers.Any(o=>o.SenderId == _currentUser.Id && o.Accepted) ||
                        x.FriendRelationSenders.Any(o=>o.ReceiverId == _currentUser.Id && o.Accepted)
                    ).PaginatedListAsync(request.PageNumber,request.PageSize);
        }
    }
}