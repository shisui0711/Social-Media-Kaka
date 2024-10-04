

using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Identities.Commands.ChangePhoneNumber
{
    [Authorize]
    public record ChangePhoneNumberCommand : IRequest<bool>
    {
        public string PhoneNumber { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    internal class ChangePhoneNumberCommandHandler : IRequestHandler<ChangePhoneNumberCommand, bool>
    {
        private readonly IIdentityService _identityService;
        private readonly IUser _currentUser;

        public ChangePhoneNumberCommandHandler(IIdentityService identityService, IUser currentUser)
        {
            _identityService = identityService;
            _currentUser = currentUser;
        }

        public async Task<bool> Handle(ChangePhoneNumberCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByIdAsync(_currentUser.Id!);
            Guard.Against.NotFound(_currentUser.Id!,user);
            bool isValidPassword = await _identityService.CheckPasswordAsync(user,request.Password);
            if(!isValidPassword) throw new UnauthorizedAccessException();
            return await _identityService.ChangePhoneNumberWithoutTokenAsync(user,request.PhoneNumber);
        }
    }
}