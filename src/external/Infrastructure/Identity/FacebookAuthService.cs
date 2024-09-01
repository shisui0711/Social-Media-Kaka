

using Application.Common.Interfaces;
using Application.Common.Models.FacebookAuthentication;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Infrastructure.Identity
{
    public class FacebookAuthService : IFacebookAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly FacebookAuthConfiguration _facebookAuthConfiguration;
        private readonly ILogger<FacebookAuthService> _logger;
        private readonly UserManager<User> _userManager;

        public FacebookAuthService(IHttpClientFactory httpClientFactory, IOptions<FacebookAuthConfiguration> facebookAuthConfiguration, ILogger<FacebookAuthService> logger, UserManager<User> userManager)
        {
            _httpClient = httpClientFactory.CreateClient("Facebook");
            _facebookAuthConfiguration = facebookAuthConfiguration.Value;
            _logger = logger;
            _userManager = userManager;
        }

        public async Task<User?> CreateUserFromFacebook(string accessToken)
        {
            try
            {
                string userInfoUrl = _facebookAuthConfiguration.UserInfoUrl;
                string url = string.Format(userInfoUrl,accessToken);

                var response = await _httpClient.GetAsync(url);


                if(!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var userInfo = JsonConvert.DeserializeObject<FacebookUserInfoResponse>(responseContent);
                if(userInfo == null) return null;

                var user = await _userManager.FindByLoginAsync(nameof(ELoginProvider.Facebook), userInfo.Id);
                if(user != null) return user; // user already exists

                user = await _userManager.FindByEmailAsync(userInfo.Email);

                if(user is null)
                {
                    user = new User
                    {
                        FirstName = userInfo.FirstName,
                        LastName = userInfo.LastName,
                        DisplayName = userInfo.Name,
                        Email = userInfo.Email,
                        UserName = userInfo.Email,
                        AvatarUrl = userInfo.Picture.Data.Url.ToString(),
                        EmailConfirmed = true,
                    };

                    await _userManager.CreateAsync(user);
                }

                UserLoginInfo userLoginInfo = new UserLoginInfo(nameof(ELoginProvider.Facebook), userInfo.Id, nameof(ELoginProvider.Facebook));
                var result = await _userManager.AddLoginAsync(user, userLoginInfo);
                if(result.Succeeded) return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, ex);
            }
            return null;
        }

        public async Task<FacebookUserInfoResponse?> GetFacebookUserInformation(string accessToken)
        {
            try
            {
                string userInfoUrl = _facebookAuthConfiguration.UserInfoUrl;
                string url = string.Format(userInfoUrl,accessToken);

                var response = await _httpClient.GetAsync(url);

                if(response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<FacebookUserInfoResponse>(responseContent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, ex);
            }

            return null;
        }

        public async Task<FacebookTokenValidationResponse?> ValidateFacebookToken(string accessToken)
        {
            try
            {
                string tokenValidationUrl = _facebookAuthConfiguration.TokenValidationUrl;
                var url = string.Format(tokenValidationUrl,accessToken,_facebookAuthConfiguration.AppId,_facebookAuthConfiguration.AppSecret);
                var response = await _httpClient.GetAsync(url);

                if(response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<FacebookTokenValidationResponse>(responseContent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, ex);
            }
            return null;
        }
    }
}