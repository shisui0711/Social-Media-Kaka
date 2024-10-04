
using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Identities.Commands.VerifyTwoFactorToken
{
    [Authorize]
    public record VerifyTwoFactorTokenCommand : IRequest<bool>
    {
        public string Token { get; set; } = null!;
    }

    internal class VerifyTwFactorTokenCommandHandler : IRequestHandler<VerifyTwoFactorTokenCommand, bool>
    {
        private readonly IIdentityService _identityService;
        private readonly IUser _currentUser;

        public VerifyTwFactorTokenCommandHandler(IIdentityService identityService, IUser currentUser)
        {
            _identityService = identityService;
            _currentUser = currentUser;
        }

        public async Task<bool> Handle(VerifyTwoFactorTokenCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByIdAsync(_currentUser.Id!);
            Guard.Against.NotFound(_currentUser.Id!,user);
            return await _identityService.VerifyTwoFactorTokenAsync(user,request.Token);
        }
    }
}