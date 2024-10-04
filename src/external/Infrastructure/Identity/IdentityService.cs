
using Application.Common.Interfaces;
using Application.Common.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities;

namespace Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
    private readonly UserManager<User> _userManager;
    private readonly IUserClaimsPrincipalFactory<User> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly ApplicationDbContext _context;

        public IdentityService(
            UserManager<User> userManager,
            IUserClaimsPrincipalFactory<User> userClaimsPrincipalFactory,
            IAuthorizationService authorizationService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _authorizationService = authorizationService;
            _context = context;
        }

        public async Task<IList<string>?> GetRolesAsync(string userId){
        var user = await _userManager.FindByIdAsync(userId);
        if(user == null) return null;
;        return await _userManager.GetRolesAsync(user);
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.UserName;
    }

    public async Task<(Result Result, User user)> CreateUserAsync(User user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);

        return (result.Succeeded
            ? Result.Success()
            : Result.Failure(result.Errors.Select(e => e.Description))
            , user);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return false;
        }

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        var result = await _authorizationService.AuthorizeAsync(principal, policyName);

        return result.Succeeded;
    }

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user != null ? await DeleteUserAsync(user.Id) : Result.Success();
    }

    public async Task<Result> DeleteUserAsync(User user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.Succeeded
            ? Result.Success()
            : Result.Failure(result.Errors.Select(e => e.Description));
    }

        public async Task<User?> FindByNameAsync(string userName)
        {
            return await _userManager.FindByNameAsync(userName);
        }

        public async Task<User?> FindByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(User user)
        {
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<string> GeneratePasswordResetTokenAsync(User user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<string> GenerateTwoFactorTokenAsync(User user)
        {
            return await _userManager.GenerateTwoFactorTokenAsync(user,TokenOptions.DefaultPhoneProvider);
        }

        public async Task<bool> VerifyTwoFactorTokenAsync(User user,string token)
        {
            return await _userManager.VerifyTwoFactorTokenAsync(user,TokenOptions.DefaultPhoneProvider,token);
        }

        public async Task<bool> ResetPasswordAsync(User user, string token, string newPassword)
        {
            var result = await _userManager.ResetPasswordAsync(user,token,newPassword);
            return result.Succeeded;
        }

        public async Task<bool> ConfirmEmailAsync(User user, string token)
        {
            return (await _userManager.ConfirmEmailAsync(user, token)).Succeeded;
        }

        public async Task<bool> ChangePasswordAsync(User user, string currentPassword, string newPassword)
        {
            return ( await _userManager.ChangePasswordAsync(user, currentPassword, newPassword)).Succeeded;
        }

        public async Task<bool> AddToRoleAsync(User user, string role)
        {
            return (await _userManager.AddToRoleAsync(user, role)).Succeeded;
        }

        public async Task<bool> RemoveFromRoleAsync(User user, string role)
        {
            return (await _userManager.RemoveFromRoleAsync(user, role)).Succeeded;
        }

        public Task<bool> CheckPasswordAsync(User user, string password)
        {
            return _userManager.CheckPasswordAsync(user, password);
        }

        public async Task<bool> ChangeEmailWithoutTokenAsync(User user, string newEmail)
        {
            await _context.Database.BeginTransactionAsync();
            var token = await _userManager.GenerateChangeEmailTokenAsync(user,newEmail);
            var result = await _userManager.ChangeEmailAsync(user,newEmail,token);
            user.EmailConfirmed = false;
            user.EmailLastChange = DateTime.Now;
            var updateResult = await _userManager.UpdateAsync(user);
            if(result.Succeeded && updateResult.Succeeded)
            {
                await _context.Database.CommitTransactionAsync();
                return true;
            }
            else
            {
                await _context.Database.RollbackTransactionAsync();
                return false;
            }
        }

        public async Task<bool> ChangePhoneNumberWithoutTokenAsync(User user, string newPhoneNumber)
        {
            await _context.Database.BeginTransactionAsync();
            var token = await _userManager.GenerateChangePhoneNumberTokenAsync(user,newPhoneNumber);
            var result = await _userManager.ChangePhoneNumberAsync(user,newPhoneNumber,token);
            user.PhoneNumberConfirmed = false;
            var updateResult = await _userManager.UpdateAsync(user);
            if(result.Succeeded && updateResult.Succeeded)
            {
                await _context.Database.CommitTransactionAsync();
                return true;
            }
            else
            {
                await _context.Database.RollbackTransactionAsync();
                return false;
            }
        }

        public async Task DisableTwoFactor(User user)
        {
            user.TwoFactorEnabled = false;
            await _userManager.UpdateAsync(user);
        }
    }
}