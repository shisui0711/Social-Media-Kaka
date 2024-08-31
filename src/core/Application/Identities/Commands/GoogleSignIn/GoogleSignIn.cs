

using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Identities.Commands.GoogleSignIn
{
    public record GoogleSignInCommand : IRequest<TokenResponse>
    {
        public string IdToken { get; init; } = null!;
    }

    internal class GoogleSignInCommandHandler : IRequestHandler<GoogleSignInCommand, TokenResponse>
    {
        private readonly IGoogleAuthService _googleAuthService;
        private readonly IJwtService _jwtService;

        public GoogleSignInCommandHandler(IGoogleAuthService googleAuthService, IJwtService jwtService)
        {
            _googleAuthService = googleAuthService;
            _jwtService = jwtService;
        }

        public async Task<TokenResponse> Handle(GoogleSignInCommand request, CancellationToken cancellationToken)
        {
            var user = await _googleAuthService.GoogleSignIn(request.IdToken);

            if(user is null) throw new UnauthorizedAccessException();

            var token = _jwtService.GenerareToken(user);
            var refreshToken = _jwtService.GenerareToken(user,true);

            return new TokenResponse
            {
                Token = token,
                RefreshToken = refreshToken
            };
        }
    }
}