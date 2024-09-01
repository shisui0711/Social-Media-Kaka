
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

namespace WebApi.Endpoints
{
    public class Auth : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .MapPost(SignIn,"sign-in")
                .MapPost(SignUp,"sign-up")
                .MapPost(ForgottenPassword,"forgotten-password")
                .MapPost(RecoveryPassword,"recovery-password")
                .MapPost(GoogleSignIn, "google-sign-in")
                .MapPost(FacebookSignIn, "facebook-sign-in")
                .MapPost(GithubSignIn,"github-sign-in");

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

        public Task<TokenResponse> GetRefreshToken(ISender sender) => sender.Send(new GetRefreshTokenQuery());
    }
}