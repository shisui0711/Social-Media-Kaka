

using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Identities.Commands.ChangePassword
{
    [Authorize]
    public record ChangePasswordCommand : IRequest<bool>
    {
        public string OldPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    internal class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
    {
        private readonly IIdentityService _identityService;
        private readonly IUser _currentUser;

        public ChangePasswordCommandHandler(IUser currentUser, IIdentityService identityService)
        {
            _currentUser = currentUser;
            _identityService = identityService;
        }

        public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByIdAsync(_currentUser.Id!);
            Guard.Against.NotFound(_currentUser.Id!,user);
            bool isValidPassword = await _identityService.CheckPasswordAsync(user,request.OldPassword);
            if(!isValidPassword) throw new UnauthorizedAccessException();
            return await _identityService.ChangePasswordAsync(user,request.OldPassword,request.NewPassword);
        }
    }
}