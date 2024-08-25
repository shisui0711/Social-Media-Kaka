

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Users.Commands.UpdateMyAvatar
{
    [Authorize]
    public record UpdateMyAvatarCommand : IRequest
    {
        public string AvatarUrl { get; set; } = null!;
    }

    internal class UpdateMyAvatarCommandHandler : IRequestHandler<UpdateMyAvatarCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public UpdateMyAvatarCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UpdateMyAvatarCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(_currentUser.Id);
            user!.AvatarUrl = request.AvatarUrl;
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}