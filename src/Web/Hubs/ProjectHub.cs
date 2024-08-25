
using System.Collections.Concurrent;
using System.Security.Claims;
using Application.Common.Models;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Hubs
{
    public class ProjectHub: Hub
{
    private static readonly ConcurrentDictionary<string, string> ConnectionIdToUserIdMap = new ConcurrentDictionary<string, string>();
    private static readonly ConcurrentDictionary<string, string> UserIdToConnectionIdMap = new ConcurrentDictionary<string, string>();
    public void RegisterUserId(string userId)
    {
        // Cập nhật mối quan hệ giữa connectionId và userId
        ConnectionIdToUserIdMap[Context.ConnectionId] = userId;
        UserIdToConnectionIdMap[userId] = Context.ConnectionId;
    }
    public override Task OnConnectedAsync()
    {
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            Clients.All.SendAsync("UserStatusChanged", userId, true);
        }
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        ConnectionIdToUserIdMap.TryRemove(Context.ConnectionId, out _);
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            UserIdToConnectionIdMap.TryRemove(userId, out _);
            Clients.All.SendAsync("UserStatusChanged", userId, false);
        }
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendComment(CommentDto comment, string postId){
        await Clients.Group(postId).SendAsync("ReceiveComment", comment);
    }

    public async Task SendMessage(MessageDto message)
    {
        await Clients.Group(message.ConversationId).SendAsync("ReceiveMessage", message);
    }

    public bool IsUserConnected(string userId)
    {
        return UserIdToConnectionIdMap.ContainsKey(userId);
    }

    public async Task JoinGroup(string conversationId){
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId != null && UserIdToConnectionIdMap.TryGetValue(userId, out var connectionId))
        {
            await Groups.AddToGroupAsync(connectionId, conversationId);
        }
    }

    public async Task LeaveGroup(string conversationId){
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId != null && UserIdToConnectionIdMap.TryGetValue(userId, out var connectionId))
        {
            await Groups.RemoveFromGroupAsync(connectionId, conversationId);
        }
    }

    public async Task SendNotification(string receiverId, string message)
    {
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (UserIdToConnectionIdMap.TryGetValue(receiverId, out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("ReceiveNotification", userId, message);
        }
    }
}
}