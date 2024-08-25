

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Posts.Commands.CreatePost
{
    [Authorize]
    public record CreatePostCommand : IRequest<PostDto>
    {
        public string Content { get; set; } = null!;
        public List<Media> Medias { get; set; } = new List<Media>();
    }

    class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, PostDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public CreatePostCommandHandler(IApplicationDbContext context, IUser currentUser, IMapper mapper)
        {
            _context = context;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            await _context.Database.BeginTransactionAsync();
            var newPost = (await _context.Posts.AddAsync(new Post{
                Content = request.Content,
                UserId = _currentUser.Id!
            })).Entity;

            if (request.Medias != null)
            {
                foreach (var requestMediaUrl in request.Medias)
                {
                    var media = new PostMedia
                    {
                        PostId = newPost.Id,
                        Url = requestMediaUrl.MediaUrl,
                        Type = requestMediaUrl.Type
                    };
                    await _context.PostMedias.AddAsync(media);
                }
            }
            await _context.SaveChangesAsync(default);
            await _context.Database.CommitTransactionAsync();
            return await _context.Posts.Where(x=>x.Id == newPost.Id)
            .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
            .FirstAsync();
        }
    }
}