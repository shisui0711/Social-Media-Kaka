

using Application.Common.Models;
using Application.Notifications.Commands.MarkAsSeenMyNotification;
using Application.Notifications.Commands.MarkAsSeenMyNotifications;
using Application.Notifications.Queries.GetMyNotificationWithPagination;
using Application.Notifications.Queries.GetTotalUnseenMyNotification;
using Application.Notifications.Queries.GetUnseenNotificationWithPagination;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Notifications : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(GetMyNotificationWithPagination)
                .MapGet(GetUnseenNotificationWithPagination, "unseen")
                .MapGet(GetTotalUnseenMyNotification,"unseen/count")
                .MapPost(MarkAsSeenMyNotification,"mark-as-read/{id}")
                .MapPost(MarkasSeenAllMyNotification,"mark-as-read");
        }

        public Task<PaginatedList<NotificationDto>> GetMyNotificationWithPagination
        (ISender sender, [AsParameters] GetMyNotifcationWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<NotificationDto>> GetUnseenNotificationWithPagination
        (ISender sender, [AsParameters] GetUnseenNotificationWithPaginationQuery query) => sender.Send(query);

        public Task<int> GetTotalUnseenMyNotification
        (ISender sender) => sender.Send(new GetTotalUnseenMyNotificationQuery());

        public Task MarkAsSeenMyNotification(ISender sender,[FromRoute] string id)
        => sender.Send(new MarkAsSeenMyNotificationCommand(){notificationId=id});

        public Task MarkasSeenAllMyNotification(ISender sender)
        => sender.Send(new MarkAsSeenMyNotificationsCommand());
    }
}