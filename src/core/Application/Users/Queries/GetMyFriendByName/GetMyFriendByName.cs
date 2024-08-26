

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Users.Queries.GetMyFriendByName
{
    [Authorize]
    public record GetMyFriendByNameQuery : IRequest<IEnumerable<UserDto>>
    {
        public string Name { get; set; } = null!;
    }

    internal class GetMyFriendByNameQueryHandler : IRequestHandler<GetMyFriendByNameQuery, IEnumerable<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public GetMyFriendByNameQueryHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<IEnumerable<UserDto>> Handle(GetMyFriendByNameQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Name)) return new List<UserDto>();
            return await _context.Users.AsNoTracking()
                .Where(x => x.DisplayName.ToLower().Contains(request.Name.ToLower()))
                .AsSplitQuery()
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .Where(x =>
                    x.FriendRelationSenders
                    .Where(o => o.SenderId == x.Id && o.ReceiverId == _currentUser.Id && o.Accepted)
                    .Select(x => new { x.SenderId, x.ReceiverId })
                    .ToList().Count > 0 ||
                    x.FriendRelationReceivers
                    .Where(o => o.SenderId == _currentUser.Id && o.ReceiverId == x.Id && o.Accepted)
                    .Select(x=> new { x.SenderId,x.ReceiverId})
                    .ToList().Count > 0
                ).Take(5)
                .ToListAsync();
        }
    }
}