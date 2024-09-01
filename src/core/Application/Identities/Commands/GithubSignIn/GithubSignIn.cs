

using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Identities.Commands.GithubSignIn
{
    public record GithubSignInCommand : IRequest<TokenResponse>
    {
        public string AccessToken { get; init; } = null!;
    }

    internal class GithubSignInCommandHandler : IRequestHandler<GithubSignInCommand, TokenResponse>
    {
        private readonly IGitHubAuthService _githubAuthService;
        private readonly IJwtService _jwtService;

        public GithubSignInCommandHandler(IGitHubAuthService githubAuthService, IJwtService jwtService)
        {
            _githubAuthService = githubAuthService;
            _jwtService = jwtService;
        }

        public async Task<TokenResponse> Handle(GithubSignInCommand request, CancellationToken cancellationToken)
        {
            var validateFacebookToken = await _githubAuthService.ValidateGitHubToken(request.AccessToken);

            if(!validateFacebookToken) throw new UnauthorizedAccessException();

            var user = await _githubAuthService.CreateUserFromGitHub(request.AccessToken);

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