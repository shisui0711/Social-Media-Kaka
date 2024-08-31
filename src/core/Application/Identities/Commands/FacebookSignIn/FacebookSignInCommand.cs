

using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Identities.Commands.FacebookSignIn
{
    public record FacebookSignInCommand : IRequest<TokenResponse>
    {
        public string AccessToken { get; init; } = null!;
    }

    internal class FacebookSignInCommandHandler : IRequestHandler<FacebookSignInCommand, TokenResponse>
    {
        private readonly IFacebookAuthService _facebookAuthService;
        private readonly IJwtService _jwtService;

        public FacebookSignInCommandHandler(IFacebookAuthService facebookAuthService, IJwtService jwtService)
        {
            _facebookAuthService = facebookAuthService;
            _jwtService = jwtService;
        }

        public async Task<TokenResponse> Handle(FacebookSignInCommand request, CancellationToken cancellationToken)
        {
            var validateFacebookToken = await _facebookAuthService.ValidateFacebookToken(request.AccessToken);

            if(validateFacebookToken == null) throw new UnauthorizedAccessException();

            var user = await _facebookAuthService.CreateUserFromFacebook(request.AccessToken);

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