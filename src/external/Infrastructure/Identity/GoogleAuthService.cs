

using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using static Google.Apis.Auth.GoogleJsonWebSignature;
using Domain.Enums;

namespace Infrastructure.Identity
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly ILogger<GoogleAuthService> _logger;
        private readonly GoogleAuthConfiguration _googleAuthConfiguration;


        public GoogleAuthService
        (UserManager<User> userManager, ILogger<GoogleAuthService> logger, IOptions<GoogleAuthConfiguration> options)
        {
            _userManager = userManager;
            _logger = logger;
            _googleAuthConfiguration = options.Value;
        }

        public async Task<User?> GoogleSignIn(string IdToken)
        {
            Payload payload;
            try
            {
                payload = await ValidateAsync(IdToken, new ValidationSettings
                {
                    Audience = [_googleAuthConfiguration.ClientId]
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return null;
            }

            var user = await _userManager.FindByLoginAsync(nameof(ELoginProvider.Google),payload.Subject);
            if(user != null) return user;
            user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new User
                {
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    DisplayName = payload.Name,
                    Email = payload.Email,
                    AvatarUrl = payload.Picture,
                    UserName = payload.Email.Split("@")[0],
                };

                await _userManager.CreateAsync(user);
                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);
            }

            UserLoginInfo info = new UserLoginInfo(nameof(ELoginProvider.Google), payload.Subject, nameof(ELoginProvider.Google));
            var result = await _userManager.AddLoginAsync(user, info);
            if(result.Succeeded) return user;
            return null;
        }
    }
}