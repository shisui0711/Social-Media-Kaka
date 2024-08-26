

using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Users.Queries.GetReceivedFriendWithPagination
{
    public record GetReceivedFriendWithPaginationQuery : IRequest<PaginatedList<UserDto>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    internal class GetReceivedFriendWithPaginationQueryHandler : IRequestHandler<GetReceivedFriendWithPaginationQuery, PaginatedList<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        private readonly IMapper _mapper;

        public GetReceivedFriendWithPaginationQueryHandler(IMapper mapper, IApplicationDbContext context, IUser currentUser)
        {
            _mapper = mapper;
            _context = context;
            _currentUser = currentUser;
        }

        public Task<PaginatedList<UserDto>> Handle(GetReceivedFriendWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return _context.Users.AsSplitQuery().ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .Where(x =>
                        x.FriendRelationSenders.Any(o => o.ReceiverId == _currentUser.Id && !o.Accepted)
                    ).PaginatedListAsync(request.PageNumber, request.PageNumber);
        }
    }
}