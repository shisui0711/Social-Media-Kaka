

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Identities.Commands.SignIn
{
    public record SignInCommand : IRequest<TokenResponse>
    {
        public string Username { set; get; } = null!;
        public string Password { set; get; } = null!;
    }

    internal class SignInCommandHandler : IRequestHandler<SignInCommand, TokenResponse>
    {
        private readonly IIdentityService _identityService;
        private readonly IJwtService _jwtService;

        public SignInCommandHandler(IIdentityService identityService, IJwtService jwtService)
        {
            _identityService = identityService;
            _jwtService = jwtService;
        }

        public async Task<TokenResponse> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.FindByNameAsync(request.Username);
            Guard.Against.NotFound(request.Username, user);

            bool isValid = await _identityService.CheckPasswordAsync(user, request.Password);
            if (!isValid) throw new UnauthorizedAccessException();
            var token = _jwtService.GenerareToken(user);
            var refreshToken = _jwtService.GenerareToken(user, true);
            return new TokenResponse()
            {
                RefreshToken = refreshToken,
                Token = token
            };
        }
    }
}