

using Application.Common.Models.FacebookAuthentication;
using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IGitHubAuthService
    {
        Task<bool> ValidateGitHubToken(string accessToken);
        Task<User?> CreateUserFromGitHub(string accessToken);
    }
}