
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
    Task<string> GenerateEmailConfirmationTokenAsync(User user);
    Task<bool> ConfirmEmailAsync(User user, string token);
    Task<bool> ChangePasswordAsync(User user, string currentPassword, string newPassword);
    Task<bool> CheckPasswordAsync(User user, string password);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AddToRoleAsync(User user, string role);
    Task<bool> RemoveFromRoleAsync(User user, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, User user)> CreateUserAsync(User user, string password);

    Task<Result> DeleteUserAsync(string userId);
}
}