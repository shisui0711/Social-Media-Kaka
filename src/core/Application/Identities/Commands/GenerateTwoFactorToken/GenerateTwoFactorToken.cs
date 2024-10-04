using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Identities.Commands.GenerateTwoFactorToken
{
    [Authorize]
    public record GenerateTwoFactorTokenCommand : IRequest<bool>;

    internal class GenerateTwoFactorTokenCommandHandler : IRequestHandler<GenerateTwoFactorTokenCommand,bool>
    {
        private readonly IIdentityService _identityService;
        private readonly IUser _currentUser;
        private readonly IEmailService _emailService;

        public GenerateTwoFactorTokenCommandHandler(IIdentityService identityService, IUser currentUser, IEmailService emailService)
        {
            _identityService = identityService;
            _currentUser = currentUser;
            _emailService = emailService;
        }

        public async Task<bool> Handle(GenerateTwoFactorTokenCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByIdAsync(_currentUser.Id!);
            Guard.Against.NotFound(_currentUser.Id!,user);
            if(!user.EmailConfirmed || user.TwoFactorEnabled) return false;
            var token = await _identityService.GenerateTwoFactorTokenAsync(user);
            await _emailService.SendTwoFactorToken(user.Email!,user.DisplayName,token);
            return true;
        }
    }
}