

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries.GetLikeInfo
{
    [Authorize]
    public record GetLikeInfoQuery : IRequest<LikeInfo>
    {
        public string PostId { get; set; } = null!;
    }

    internal class GetLikeInfoQueryHandler : IRequestHandler<GetLikeInfoQuery, LikeInfo>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public GetLikeInfoQueryHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<LikeInfo> Handle(GetLikeInfoQuery request, CancellationToken cancellationToken)
        {
            var data = await _context.Posts
            .Where(p => p.Id == request.PostId)
            .Select(p => new LikeInfo()
            {
                likes = p.Likes.Count(),
                isLikedByUser = p.Likes.Where(l => l.UserId == _currentUser.Id)
                    .Select(l => new { l.UserId })
                    .ToList().Count > 0,
            })
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.PostId,data);
            return data;
        }
    }
}