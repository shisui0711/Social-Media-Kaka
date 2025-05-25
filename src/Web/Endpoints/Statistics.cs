

using Application.Statistics.GetPostDataPoint;
using Application.Statistics.GetPostPercentTrend;
using Application.Statistics.GetTotalConversation;
using Application.Statistics.GetTotalMedia;
using Application.Statistics.GetTotalPost;
using Application.Statistics.GetTotalUser;
using Application.Statistics.GetUserDataPoint;
using Application.Statistics.GetUserPercentTrend;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;
using WebApi.Infrastructure;

namespace Web.Endpoints
{
    public class Statistics : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(GetTotalUser, "total-user")
                .MapGet(GetTotalMedia, "total-media")
                .MapGet(GetTotalPost, "total-post")
                .MapGet(GetTotalConversation, "total-conversation")
                .MapGet(GetUserDataPoints, "user-datapoints")
                .MapGet(GetPostDataPoints, "post-datapoints")
                .MapGet(GetPostPercentTrend, "post-trend")
                .MapGet(GetUserPercentTrend, "user-trend")
                .MapGet(GetTotalUserOnline, "total-online");

        }

        public Task<int> GetTotalUser(ISender sender) => sender.Send(new GetTotalUserQuery());
        public Task<int> GetTotalPost(ISender sender) => sender.Send(new GetTotalPostQuery());
        public Task<int> GetTotalConversation(ISender sender) => sender.Send(new GetTotalConversationQuery());
        public Task<int> GetTotalMedia(ISender sender) => sender.Send(new GetTotalMediaQuery());
        public Task<IEnumerable<KeyValuePair<DateTime, int>>> GetUserDataPoints
        (ISender sender, [AsParameters] GetUserDataPointQuery query) => sender.Send(query);
        public Task<IEnumerable<KeyValuePair<DateTime, int>>> GetPostDataPoints
        (ISender sender, [AsParameters] GetPostDataPointQuery query) => sender.Send(query);

        public Task<double> GetUserPercentTrend(ISender sender, [AsParameters] GetUserPercentTrendQuery query)
        => sender.Send(query);
        public Task<double> GetPostPercentTrend(ISender sender, [AsParameters] GetPostPercentTrendQuery query)
        => sender.Send(query);

        public Task<int> GetTotalUserOnline()
        => Task.FromResult(ProjectHub.GetUniqueUsersCount());
    }
}