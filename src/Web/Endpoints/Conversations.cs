

using Application.Common.Models;
using Application.Conversations.Commands.EnsureCreatedConversation;
using Application.Conversations.Commands.RemoveConversation;
using Application.Conversations.Queries.GetMyConversationInfo;
using Application.Conversations.Queries.GetMyConversationsWithPagination;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Conversations : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(GetMyConversationWithPagination)
                .MapGet(GetMyConversationInfo,"{id}")
                .MapPost(EnsureCreatedConversation)
                .MapDelete(RemoveConversation,"{id}");
        }

        public Task<PaginatedList<ConversationDto>> GetMyConversationWithPagination
        (ISender sender, [AsParameters] GetMyConversationsWithPaginationQuery query) => sender.Send(query);

        public Task<ConversationDto> GetMyConversationInfo(ISender sender, [FromRoute] string id)
        => sender.Send(new GetMyConversationInfoQuery(){ConversationId = id});

        public Task<ConversationDto> EnsureCreatedConversation
        (ISender sender, [FromBody] EnsureCreatedConversationCommand command) => sender.Send(command);

        public Task<ConversationDto> RemoveConversation(ISender sender ,[FromRoute] string id)
        => sender.Send(new RemoveConversationCommand(){ConversationId = id});
    }
}