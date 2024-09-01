

using System.Net.Http.Headers;
using System.Text;
using Application.Common.Interfaces;
using Application.Common.Models.GithubAuthentication;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Infrastructure.Identity
{
    public class GitHubAuthService : IGitHubAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly HttpClient _httpClient;
        private readonly ILogger<GitHubAuthService> _logger;
        private readonly GitHubAuthConfiguration _githubAuthConfiguration;

        public GitHubAuthService
        (UserManager<User> userManager, IHttpClientFactory httpClientFactory, ILogger<GitHubAuthService> logger,
        IOptions<GitHubAuthConfiguration> options
        )
        {
            _userManager = userManager;
            _httpClient = httpClientFactory.CreateClient("Github");
            _logger = logger;
            _githubAuthConfiguration = options.Value;
        }

        public async Task<User?> CreateUserFromGitHub(string accessToken)
        {
            try
            {
                string userInfoUrl = _githubAuthConfiguration.UserInfoUrl;
                var request = new HttpRequestMessage(HttpMethod.Get,userInfoUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                request.Headers.Add("X-GitHub-Api-Version", "2022-11-28");
                request.Headers.Add("User-Agent", _githubAuthConfiguration.AppName);
                var response = await _httpClient.SendAsync(request);
                if(!response.IsSuccessStatusCode) return null;
                var responseContent = await response.Content.ReadAsStringAsync();
                var userInfo = JsonConvert.DeserializeObject<GithubUserInfoResponse>(responseContent);
                if(userInfo == null) return null;
                var user = await _userManager.FindByLoginAsync(nameof(ELoginProvider.Github), userInfo.Id);
                if(user != null) return user; // user already exists

                user = await _userManager.FindByEmailAsync(userInfo.Email);

                if(user is null)
                {
                    user = new User
                    {
                        FirstName = userInfo.Name.Split(" ").First(),
                        LastName = userInfo.Name.Split(" ").Last(),
                        DisplayName = userInfo.Name,
                        Email = userInfo.Email,
                        UserName = userInfo.Login,
                        Bio = userInfo.Bio,
                        AvatarUrl = userInfo.AvatarUrl,
                        EmailConfirmed = true,
                    };

                    await _userManager.CreateAsync(user);
                }

                UserLoginInfo userLoginInfo = new UserLoginInfo(nameof(ELoginProvider.Github), userInfo.Id, nameof(ELoginProvider.Github));
                var result = await _userManager.AddLoginAsync(user, userLoginInfo);
                if(result.Succeeded) return user;
                return null;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, ex);
                return null;
            }
        }

        public async Task<bool> ValidateGitHubToken(string accessToken)
        {
            try
            {
                string tokenValidationUrl = _githubAuthConfiguration.TokenValidationUrl;
                string url = string.Format(tokenValidationUrl,_githubAuthConfiguration.ClientId);
                var request = new HttpRequestMessage(HttpMethod.Post,url);
                request.Headers.Authorization = new AuthenticationHeaderValue(
                    "Basic",Convert.ToBase64String(
                        Encoding.ASCII.GetBytes($"{_githubAuthConfiguration.ClientId}:{_githubAuthConfiguration.ClientSecret}")
                        )
                    );
                request.Headers.Add("Accept", "application/vnd.github+json");
                request.Headers.Add("X-GitHub-Api-Version", "2022-11-28");
                request.Headers.Add("User-Agent", _githubAuthConfiguration.AppName);
                request.Content = new StringContent($"{{\"access_token\":\"{accessToken}\"}}", Encoding.UTF8, "application/json");
                var response = await _httpClient.SendAsync(request);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, ex);
                return false;
            }
        }
    }
}