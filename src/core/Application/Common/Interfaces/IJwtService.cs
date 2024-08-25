
using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IJwtService
    {
        public string GenerareToken(User user, bool isRefresh = false);
        public Task<(string token, string refreshToken)> RefreshToken();
    }
}