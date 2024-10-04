
using Application.Common.Models;
using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IIdentityService
{
    Task<IList<string>?> GetRolesAsync(string userId);
    Task<string?> GetUserNameAsync(string userId);
    Task<User?> FindByNameAsync(string userName);
    Task<User?> FindByIdAsync(string userId);
    Task<User?> FindByEmailAsync(string email);
    Task DisableTwoFactor(User user);
    Task<string> GenerateEmailConfirmationTokenAsync(User user);
    Task<string> GeneratePasswordResetTokenAsync(User user);
    Task<string> GenerateTwoFactorTokenAsync(User user);
    Task<bool> VerifyTwoFactorTokenAsync(User user,string token);
    Task<bool> ResetPasswordAsync(User user, string token, string newPassword);
    Task<bool> ConfirmEmailAsync(User user, string token);
    Task<bool> ChangePasswordAsync(User user, string currentPassword, string newPassword);
    Task<bool> ChangeEmailWithoutTokenAsync(User user, string newEmail);
    Task<bool> ChangePhoneNumberWithoutTokenAsync(User user, string newPhoneNumber);
    Task<bool> CheckPasswordAsync(User user, string password);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AddToRoleAsync(User user, string role);
    Task<bool> RemoveFromRoleAsync(User user, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, User user)> CreateUserAsync(User user, string password);

    Task<Result> DeleteUserAsync(string userId);
}
}