

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Comments.Commands.RemoveComment
{
    [Authorize]
    public record RemoveCommentCommand : IRequest<CommentDto>
    {
        public string CommentId { get; set; } = null!;
    }

    internal class RemoveCommentCommandHandler : IRequestHandler<RemoveCommentCommand, CommentDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public RemoveCommentCommandHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<CommentDto> Handle(RemoveCommentCommand request, CancellationToken cancellationToken)
        {
            Guard.Against.NullOrEmpty(_currentUser.Id);
            var comment = await _context.Comments.FindAsync(request.CommentId);
            Guard.Against.NotFound(request.CommentId, comment);
            if (comment.UserId != _currentUser.Id) throw new ForbiddenAccessException();
            var removed = _context.Comments.Remove(comment).Entity;
            await _context.SaveChangesAsync(default);
            return _mapper.Map<CommentDto>(removed);
        ;
        }
    }
}