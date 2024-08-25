

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Comments.Queries.GetCommentLikeInfo
{
    public record GetCommentLikeInfoQuery : IRequest<LikeInfo>
    {
        public string CommentId { get; set; } = null!;
    }

    internal class GetCommentLikeInfoQueryHandler : IRequestHandler<GetCommentLikeInfoQuery,LikeInfo>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        public GetCommentLikeInfoQueryHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<LikeInfo> Handle(GetCommentLikeInfoQuery request, CancellationToken cancellationToken)
        {
            var data = await _context.Comments
            .Where(p => p.Id == request.CommentId)
            .Select(p => new LikeInfo()
            {
                likes = p.CommentLikes.Count(),
                isLikedByUser = p.CommentLikes.Where(l => l.UserId == _currentUser.Id)
                    .Select(l => new { l.UserId })
                    .ToList().Count > 0,
            })
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.CommentId,data);
            return data;
        }
    }
}