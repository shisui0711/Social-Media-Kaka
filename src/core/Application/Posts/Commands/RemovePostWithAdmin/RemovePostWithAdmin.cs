using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Posts.Commands.RemovePostWithAdmin
{
    [Authorize(Roles = Roles.Administrator)]
    public record RemovePostWithAdminCommand : IRequest<PostDto>
    {
        public string PostId { get; init; } = null!;
    }

    internal class RemovePostWithAdminCommandHandler(
        IApplicationDbContext context,
        IMapper mapper
    ) : IRequestHandler<RemovePostWithAdminCommand, PostDto>
    {
        public async Task<PostDto> Handle(RemovePostWithAdminCommand request, CancellationToken cancellationToken)
        {
            var post = context.Posts.Find(request.PostId);
            Guard.Against.NotFound(request.PostId, post);

            context.Posts.Remove(post);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<PostDto>(post);
        }
    }
}