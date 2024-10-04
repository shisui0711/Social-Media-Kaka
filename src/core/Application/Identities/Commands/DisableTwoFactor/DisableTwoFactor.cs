


using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Identities.Commands.DisableTwoFactor
{
    [Authorize]
    public record DisableTwoFactorCommand : IRequest;

    internal class DisableTwoFactorCommandHandler : IRequestHandler<DisableTwoFactorCommand>
    {
        private readonly IIdentityService _identityService;
        private readonly IUser _currentUser;

        public DisableTwoFactorCommandHandler(IIdentityService identityService, IUser currentUser)
        {
            _identityService = identityService;
            _currentUser = currentUser;
        }

        public async Task Handle(DisableTwoFactorCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByIdAsync(_currentUser.Id!);
            Guard.Against.NotFound(_currentUser.Id!,user);
            await _identityService.DisableTwoFactor(user);
        }
    }
}