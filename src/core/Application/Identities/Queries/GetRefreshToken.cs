

using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Identities.Queries
{
    public record GetRefreshTokenQuery : IRequest<TokenResponse>;

    internal class GetRefreshTokenQueryHandler : IRequestHandler<GetRefreshTokenQuery, TokenResponse>
    {
        private readonly IJwtService _jwtService;

        public GetRefreshTokenQueryHandler(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }

        public async Task<TokenResponse> Handle(GetRefreshTokenQuery request, CancellationToken cancellationToken)
        {
            var data = await _jwtService.RefreshToken();
            return new TokenResponse{
                Token = data.token,
                RefreshToken = data.refreshToken
            };
        }
    }
}