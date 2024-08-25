

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Commands.RemovePost
{
    [Authorize]
    public class RemovePostCommand : IRequest<PostDto>
    {
        public string PostId { get; set; } = null!;
    }

    internal class RemovePostCommandHandler : IRequestHandler<RemovePostCommand, PostDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RemovePostCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PostDto> Handle(RemovePostCommand request, CancellationToken cancellationToken)
        {
            var post = _context.Posts.Find(request.PostId);
            Guard.Against.NotFound(request.PostId,post);

            _context.Posts.Remove(post);

            await _context.SaveChangesAsync(default);

            return _mapper.Map<PostDto>(post);
        }
    }
}