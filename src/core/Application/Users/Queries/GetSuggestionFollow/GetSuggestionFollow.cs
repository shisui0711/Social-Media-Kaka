

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Users.Queries.GetSuggestionFollow
{
    [Authorize]
    public record GetSuggestionFollowQuery : IRequest<IEnumerable<UserDto>>;

    internal class GetSuggestionFollowQueryHandler : IRequestHandler<GetSuggestionFollowQuery, IEnumerable<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        private readonly IMapper _mapper;

        public GetSuggestionFollowQueryHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<IEnumerable<UserDto>> Handle(GetSuggestionFollowQuery request, CancellationToken cancellationToken)
        {
            return await _context.Users.AsSplitQuery().ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .Where(x => x.Id != _currentUser.Id && !x.Followers.Any(x => x.FollowerId == _currentUser.Id))
            .OrderByDescending(x => x.DisplayName)
            .Take(5).AsNoTracking().ToListAsync();
        }
    }
}