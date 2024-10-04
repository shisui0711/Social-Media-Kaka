

using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Identities.Commands.CheckPassword
{
    [Authorize]
    public record CheckPasswordCommand : IRequest<bool>
    {
        public string Password { get; set; } = null!;
    }

    internal class CheckPasswordCommandHandler(
        IIdentityService _identityService,
        IUser _currentUser
    ) : IRequestHandler<CheckPasswordCommand, bool>
    {
        public async Task<bool> Handle(CheckPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByIdAsync(_currentUser.Id!);
            if (user == null) throw new UnauthorizedAccessException();
            return await _identityService.CheckPasswordAsync(user,request.Password);
        }
    }
}