
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Users.Queries.GetFollowInfo
{
    [Authorize]
    public record GetFollowInfoQuery : IRequest<FollowInfo>
    {
        public string UserId { get; set; } = null!;
    }

    internal class GetFollowInfoQueryHandler : IRequestHandler<GetFollowInfoQuery, FollowInfo>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public GetFollowInfoQueryHandler(IApplicationDbContext context, IUser currentUser, IMapper mapper)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<FollowInfo> Handle(GetFollowInfoQuery request, CancellationToken cancellationToken)
        {
            var data = await _context.Users.Where(x=>x.Id == request.UserId)
            .Select(x => new FollowInfo
            {
                followers = x.Followers.Count,
                isFollowedByUser = x.Followers.Where(o => o.FollowerId == _currentUser.Id)
                    .Select(x => new { x.FollowerId })
                    .ToList().Count > 0
            }).FirstOrDefaultAsync();
            Guard.Against.NotFound(request.UserId,data);
            return data;
        }
    }
}