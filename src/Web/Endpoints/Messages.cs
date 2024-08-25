
using Application.Common.Models;
using Application.Messages.Commands.CreateMessage;
using Application.Messages.Queries.GetMyMessagesWithPagination;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Messages : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(GetMyMessageWithPagination)
                .MapPost(CreateMessage);
        }

        public Task<PaginatedList<MessageDto>> GetMyMessageWithPagination
        (ISender sender, [AsParameters] GetMyMessagesWithPaginationQuery query) => sender.Send(query);

        public Task<MessageDto> CreateMessage(ISender sender, [FromBody] CreateMessageCommand command)
        => sender.Send(command);
    }
}