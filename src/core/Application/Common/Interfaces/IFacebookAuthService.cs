

using Application.Common.Models.FacebookAuthentication;
using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IFacebookAuthService
    {
        Task<FacebookTokenValidationResponse?> ValidateFacebookToken(string accessToken);
        Task<FacebookUserInfoResponse?> GetFacebookUserInformation(string accessToken);
        Task<User?> CreateUserFromFacebook(string accessToken);
    }
}