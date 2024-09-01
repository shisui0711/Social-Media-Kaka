


using Application.Common.Interfaces;

namespace Application.Identities.Commands.RecoveryPassword
{
    public record RecoveryPasswordCommand : IRequest<bool>
    {
        public string Email { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    internal class RecoveryPasswordCommandHandler : IRequestHandler<RecoveryPasswordCommand,bool>
    {
        private readonly IIdentityService _identityService;

        public RecoveryPasswordCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<bool> Handle(RecoveryPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByEmailAsync(request.Email);
            if(user is null) return false;
            return await _identityService.ResetPasswordAsync(user,request.Token,request.NewPassword);
        }
    }
}