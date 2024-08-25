
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Users.Queries.GetFriendInfo
{
    [Authorize]
    public record GetFriendInfoQuery : IRequest<FriendInfo>
    {
        public string UserId { get; set; } = null!;
    }

    internal class GetFriendInfoQueryHandler : IRequestHandler<GetFriendInfoQuery, FriendInfo>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public GetFriendInfoQueryHandler(IUser currentUser, IApplicationDbContext context)
        {
            _currentUser = currentUser;
            _context = context;
        }

        public async Task<FriendInfo> Handle(GetFriendInfoQuery request, CancellationToken cancellationToken)
        {
            var data = await _context.Users
            .Where(x=>x.Id == request.UserId)
            .Include(x=>x.FriendRelationReceivers)
            .Include(x=>x.FriendRelationSenders)
            .Select(x => new FriendInfo
            {
                friends = x.FriendRelationReceivers.Count(x=>x.Accepted) + x.FriendRelationSenders.Count(x=>x.Accepted),
                isSended = x.FriendRelationReceivers
                .Where(o => o.SenderId == _currentUser.Id && o.ReceiverId == request.UserId)
                .Select(x => new { x.SenderId, x.ReceiverId })
                .ToList().Count > 0,
                isFriend = x.FriendRelationSenders
                .Where(o => o.SenderId == request.UserId && o.ReceiverId == _currentUser.Id && o.Accepted)
                .Select(x => new { x.SenderId, x.ReceiverId })
                .ToList().Count > 0 ||
                x.FriendRelationReceivers
                .Where(o => o.SenderId == _currentUser.Id && o.ReceiverId == request.UserId && o.Accepted)
                .Select(x=> new { x.SenderId,x.ReceiverId})
                .ToList().Count > 0
            }).FirstOrDefaultAsync();
            Guard.Against.NotFound(request.UserId,data);
            return data;
        }
    }
}