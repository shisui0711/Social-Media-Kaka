

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Commands.RemovePost
{
    [Authorize]
    public record RemovePostCommand : IRequest<PostDto>
    {
        public string PostId { get; init; } = null!;
    }

    internal class RemovePostCommandHandler : IRequestHandler<RemovePostCommand, PostDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public RemovePostCommandHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PostDto> Handle(RemovePostCommand request, CancellationToken cancellationToken)
        {
            var post = _context.Posts.Find(request.PostId);
            Guard.Against.NotFound(request.PostId,post);

            if(post.UserId != _currentUser.Id) throw new ForbiddenAccessException();

            _context.Posts.Remove(post);

            await _context.SaveChangesAsync(default);

            return _mapper.Map<PostDto>(post);
        }
    }
}