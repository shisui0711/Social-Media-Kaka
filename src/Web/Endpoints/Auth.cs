
using Application.Common.Models;
using Application.Identities.Commands.SignIn;
using Application.Identities.Commands.SignUp;
using Application.Identities.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Auth : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .MapPost(SignIn,"sign-in")
                .MapPost(SignUp,"sign-up");

            app.MapGroup(this)
                .RequireAuthorization(Policies.RefreshToken)
                .MapGet(GetRefreshToken, "refresh-token");
        }

        public Task SignUp(ISender sender, [FromBody] SignUpCommand command) => sender.Send(command);

        public Task<TokenResponse> SignIn(ISender sender, [FromBody] SignInCommand command) => sender.Send(command);

        public Task<TokenResponse> GetRefreshToken(ISender sender) => sender.Send(new GetRefreshTokenQuery());
    }
}