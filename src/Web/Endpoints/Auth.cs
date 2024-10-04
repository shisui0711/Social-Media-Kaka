
using Application.Common.Models;
using Application.Identities.Commands.FacebookSignIn;
using Application.Identities.Commands.GithubSignIn;
using Application.Identities.Commands.GoogleSignIn;
using Application.Identities.Commands.SignIn;
using Application.Identities.Commands.SignUp;
using Application.Identities.Queries;
using Application.Identities.Commands.ForgottenPassword;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;
using Application.Identities.Commands.RecoveryPassword;
using Application.Identities.Commands.ChangeEmail;
using Application.Identities.Commands.ChangePhoneNumber;
using Application.Identities.Commands.ChangePassword;
using Application.Identities.Commands.CheckPassword;
using Application.Identities.Commands.GenerateTwoFactorToken;
using Application.Identities.Commands.VerifyTwoFactorToken;
using Application.Identities.Commands.DisableTwoFactor;

namespace WebApi.Endpoints
{
    public class Auth : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .AllowAnonymous()
                .MapPost(SignIn, "sign-in")
                .MapPost(SignUp, "sign-up")
                .MapPost(ForgottenPassword, "forgotten-password")
                .MapPost(RecoveryPassword, "recovery-password")
                .MapPost(ChangeEmail, "change-email")
                .MapPost(ChangePhoneNumber, "change-phone-number")
                .MapPost(ChangePassword, "change-password")
                .MapPost(GoogleSignIn, "google-sign-in")
                .MapPost(FacebookSignIn, "facebook-sign-in")
                .MapPost(GithubSignIn, "github-sign-in")
                .MapPost(GenerateTwoFactorToken, "generate-2fa")
                .MapPost(VerifyTwoFactorToken, "verify-2fa");

            app.MapGroup(this)
            .RequireAuthorization(Policies.AccessToken)
            .MapPost(CheckPassword, "password")
            .MapPost(DisableTwoFactor, "disable-2fa");

            app.MapGroup(this)
                .RequireAuthorization(Policies.RefreshToken)
                .MapGet(GetRefreshToken, "refresh-token");
        }

        public Task SignUp(ISender sender, [FromBody] SignUpCommand command) => sender.Send(command);

        public Task<TokenResponse> SignIn(ISender sender, [FromBody] SignInCommand command) => sender.Send(command);

        public Task<TokenResponse> GoogleSignIn(ISender sender, [FromBody] GoogleSignInCommand command)
        => sender.Send(command);

        public Task<TokenResponse> FacebookSignIn(ISender sender, [FromBody] FacebookSignInCommand command)
        => sender.Send(command);

        public Task<TokenResponse> GithubSignIn(ISender sender, [FromBody] GithubSignInCommand command)
        => sender.Send(command);

        public Task ForgottenPassword(ISender sender, [FromBody] ForgottenPasswordCommand command)
        => sender.Send(command);

        public Task<bool> RecoveryPassword(ISender sender, [FromBody] RecoveryPasswordCommand command)
        => sender.Send(command);

        public Task<bool> ChangeEmail(ISender sender, [FromBody] ChangeEmailCommand command)
        => sender.Send(command);

        public Task<bool> ChangePhoneNumber(ISender sender, [FromBody] ChangePhoneNumberCommand command)
        => sender.Send(command);

        public Task<bool> ChangePassword(ISender sender, [FromBody] ChangePasswordCommand command)
        => sender.Send(command);

        public Task<TokenResponse> GetRefreshToken(ISender sender) => sender.Send(new GetRefreshTokenQuery());
        public Task<bool> GenerateTwoFactorToken(ISender sender) => sender.Send(new GenerateTwoFactorTokenCommand());
        public Task<bool> VerifyTwoFactorToken(ISender sender, [FromBody] VerifyTwoFactorTokenCommand command)
        => sender.Send(command);
        public Task<bool> CheckPassword(ISender sender, [FromBody] CheckPasswordCommand command)
        => sender.Send(command);

        public Task DisableTwoFactor(ISender sender)
        => sender.Send(new DisableTwoFactorCommand());

    }
}