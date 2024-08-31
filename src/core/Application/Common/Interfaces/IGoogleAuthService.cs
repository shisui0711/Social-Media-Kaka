


using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<User?> GoogleSignIn(string IdToken);
    }
}