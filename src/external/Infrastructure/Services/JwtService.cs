


using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly JwtConfiguration _jwtConfiguration;
        private readonly IUser _currentUser;
        private readonly UserManager<User> _userManager;

        public JwtService(IOptions<JwtConfiguration> jwtConfiguration, IUser currentUser, UserManager<User> userManager)
        {
            _jwtConfiguration = jwtConfiguration.Value;
            _currentUser = currentUser;
            _userManager = userManager;
        }

        public string GenerareToken(User user, bool isRefresh = false)
        {
            var authClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            if (isRefresh)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, "Refresh"));
            }
            else
            {
                authClaims.Add(new Claim(ClaimTypes.Role, "Access"));
            }
            var userRoles = _userManager.GetRolesAsync(user).Result;
            if (userRoles != null)
            {
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
            }
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfiguration.Key));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            var expires = isRefresh ?
                DateTime.UtcNow.AddSeconds(_jwtConfiguration.RefreshTimeStamp)
                : DateTime.UtcNow.AddSeconds(_jwtConfiguration.LifeTimeStamp);
            var jwtToken = new JwtSecurityToken(
                claims: authClaims,
                notBefore: DateTime.UtcNow,
                expires: expires,
                audience: _jwtConfiguration.Audience,
                issuer: _jwtConfiguration.Issuer,
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        public async Task<(string token, string refreshToken)> RefreshToken()
        {
            if (_currentUser.Id == null) throw new UnauthorizedAccessException();
            var user = await _userManager.FindByIdAsync(_currentUser.Id) ?? throw new UnauthorizedAccessException();
            var newToken = GenerareToken(user!);
            var refreshToken = GenerareToken(user, true);
            return (newToken, refreshToken);
        }
    }
}