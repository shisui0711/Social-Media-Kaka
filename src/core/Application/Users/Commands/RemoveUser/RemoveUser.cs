
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Constants;

namespace Application.Users.Commands.RemoveUser
{
    [Authorize(Roles = Roles.Administrator)]
    public record RemoveUserCommand : IRequest<UserDto>
    {
        public string UserId { get; init; } = null!;
    }

    internal class RemoveUserCommandHandler(
        IApplicationDbContext context,
        IMapper mapper
    ) : IRequestHandler<RemoveUserCommand, UserDto>
    {
        public async Task<UserDto> Handle(RemoveUserCommand request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FindAsync(request.UserId);
            Guard.Against.NotFound(request.UserId, user);

            context.Users.Remove(user);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<UserDto>(user);
        }
    }
}