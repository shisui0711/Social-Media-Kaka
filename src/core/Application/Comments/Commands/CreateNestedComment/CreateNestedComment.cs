

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Comments.Commands.CreateNestedComment
{
    [Authorize]
    public record CreateNestedCommentCommand : IRequest<CommentDto>
    {
        public string CommentId { get; set; } = null!;
        public string Content { get; set; } = null!;
    }

    internal class CreateNestedCommentCommandHandler : IRequestHandler<CreateNestedCommentCommand, CommentDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public CreateNestedCommentCommandHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<CommentDto> Handle(CreateNestedCommentCommand request, CancellationToken cancellationToken)
        {

            var comment = await _context.Comments.FindAsync(request.CommentId);
            Guard.Against.NotFound(request.CommentId, comment);
            await _context.Database.BeginTransactionAsync();
            try
            {   var parrentId = comment.ParentId ?? comment.Id;
                var newComment = (await _context.Comments.AddAsync(new Comment
                {
                    PostId = comment.PostId,
                    ParentId = parrentId,
                    Content = request.Content,
                    UserId = _currentUser.Id!
                })).Entity;

                if (comment.UserId != _currentUser.Id)
                {

                    await _context.Notifications.AddAsync(new Notification
                    {
                        IssuerId = _currentUser.Id,
                        RecipientId = comment.UserId,
                        PostId = comment.PostId,
                        Type = "COMMENT"
                    });
                }
                await _context.SaveChangesAsync(default);
                await _context.Database.CommitTransactionAsync();
                return _mapper.Map<CommentDto>(newComment);
            }
            catch (Exception)
            {
                await _context.Database.RollbackTransactionAsync();
                throw;
            }
        }
    }
}