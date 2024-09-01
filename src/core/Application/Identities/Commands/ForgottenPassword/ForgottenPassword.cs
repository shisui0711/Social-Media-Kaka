


using Application.Common.Interfaces;

namespace Application.Identities.Commands.ForgottenPassword
{
    public record ForgottenPasswordCommand : IRequest
    {
        public string Email { get; init; } = null!;
    }

    internal class ForgottenPasswordCommandHandler : IRequestHandler<ForgottenPasswordCommand>
    {
        private readonly IEmailService _emailService;
        private readonly IIdentityService _identityService;

        public ForgottenPasswordCommandHandler(IEmailService emailService, IIdentityService identityService)
        {
            _emailService = emailService;
            _identityService = identityService;
        }

        public async Task Handle(ForgottenPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByEmailAsync(request.Email);
            if(user != null)
            {
                var token = await _identityService.GeneratePasswordResetTokenAsync(user);
                await _emailService.SendRecoveryToken(user.Email!,user.DisplayName,token);
            }
        }
    }
}