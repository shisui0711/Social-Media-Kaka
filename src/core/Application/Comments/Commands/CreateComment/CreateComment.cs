

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Comments.Commands.CreateComment
{
    [Authorize]
    public record CreateCommentCommand : IRequest<CommentDto>
    {
        public string PostId { get; set; } = null!;
        public string Content { get; set; } = null!;
    }

    internal class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, CommentDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public CreateCommentCommandHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<CommentDto> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            Guard.Against.NullOrEmpty(_currentUser.Id);

            var post = await _context.Posts.FindAsync(request.PostId);
            Guard.Against.NotFound(request.PostId,post);
            await _context.Database.BeginTransactionAsync();
            try
            {
                var comment = (await _context.Comments.AddAsync(new Comment
                {
                    PostId = request.PostId,
                    Content = request.Content,
                    UserId = _currentUser.Id
                })).Entity;

                if (post.UserId != _currentUser.Id)
                {

                    await _context.Notifications.AddAsync(new Notification
                    {
                        IssuerId = _currentUser.Id,
                        RecipientId = post.UserId,
                        PostId = post.Id,
                        Type = "COMMENT"
                    });
                }
                await _context.SaveChangesAsync(default);
                await _context.Database.CommitTransactionAsync();
                return _mapper.Map<CommentDto>(comment);
            }
            catch (Exception)
            {
                await _context.Database.RollbackTransactionAsync();
                throw;
            }
        }
    }
}