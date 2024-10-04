
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Errors;
using Domain.Exceptions;

namespace Application.Identities.Commands.ChangeEmail
{
    [Authorize]
    public record ChangeEmailCommand : IRequest<bool>
    {
        public string Email { get; init; } = null!;
        public string Password { get; init; } = null!;
    }

    internal class ChangeEmailCommandHandler : IRequestHandler<ChangeEmailCommand, bool>
    {
        private readonly IIdentityService _identityService;
        private readonly IUser _currentUser;

        public ChangeEmailCommandHandler(IUser currentUser, IIdentityService identityService)
        {
            _currentUser = currentUser;
            _identityService = identityService;
        }

        public async Task<bool> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByEmailAsync(request.Email);
            if(user != null) throw new DomainException(DomainErrors.User.EmailAlreadyExists);
            user = await _identityService.FindByIdAsync(_currentUser.Id!);
            Guard.Against.NotFound(_currentUser.Id!,user);
            if(user.EmailLastChange >= DateTime.Now.AddDays(-30)) return false;
            if(user.Id != _currentUser.Id!) throw new ForbiddenAccessException();
            bool isValidPassword = await _identityService.CheckPasswordAsync(user,request.Password);
            if(!isValidPassword) throw new UnauthorizedAccessException();
            return await _identityService.ChangeEmailWithoutTokenAsync(user,request.Email);
        }
    }
}