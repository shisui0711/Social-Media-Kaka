
using System.Collections.Concurrent;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Hubs
{
    public class ProjectHub : Hub
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProjectHub(IMapper mapper, IApplicationDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        private static readonly ConcurrentDictionary<string, HashSet<string>> _userConnections = new();
        public override Task OnConnectedAsync()
        {
            if (Context.UserIdentifier != null)
            {
                _userConnections.AddOrUpdate(Context.UserIdentifier,
                _ => new HashSet<string> { Context.ConnectionId },
                (_, connections) =>
                {
                    connections.Add(Context.ConnectionId);
                    return connections;
                });
                Clients.All.SendAsync("UserStatusChanged", Context.UserIdentifier, true);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.UserIdentifier != null)
            {
                if (_userConnections.TryGetValue(Context.UserIdentifier, out var connections))
                {
                    connections.Remove(Context.ConnectionId);
                    if (connections.Count == 0)
                    {
                        // Không còn kết nối nào -> Xóa userId khỏi danh sách
                        _userConnections.TryRemove(Context.UserIdentifier, out _);
                        // Xử lý khi user offline
                        Clients.All.SendAsync("UserStatusChanged", Context.UserIdentifier, false);
                    }
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

        public static int GetUniqueUsersCount()
        {
            return _userConnections.Count;
        }

        public async Task SendComment(CommentDto comment, string postId)
        {
            await Clients.Group(postId).SendAsync("ReceiveComment", comment);
        }

        public async Task SendFriendRequest(string userId)
        {
            if (Context.UserIdentifier != null)
            {
                UserDto user = await _context.Users.AsNoTracking().Where(x => x.Id == Context.UserIdentifier)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstAsync();
                await Clients.User(userId).SendAsync("ReceiveFriendRequest", user);
            }
        }

        public async Task SendCancelFriend(string userId)
        {
            if (Context.UserIdentifier != null)
            {
                await Clients.User(userId).SendAsync("ReceiveCancelFriend", Context.UserIdentifier);
            }
        }
        public async Task SendMessage(MessageDto message)
        {
            await Clients.Group(message.ConversationId).SendAsync("ReceiveMessage", message);
        }


        public async Task JoinGroup(string conversationId)
        {
            if (Context.UserIdentifier != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
            }
        }

        public async Task LeaveGroup(string conversationId)
        {
            if (Context.UserIdentifier != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
            }
        }
        public bool IsUserConnected(string userId)
        {
            return _userConnections.ContainsKey(userId);
        }
        public async Task SendNotification(string receiverId, string message)
        {
            if (Context.UserIdentifier != null)
            {
                await Clients.User(receiverId).SendAsync("ReceiveNotification", Context.UserIdentifier, message);
            }
        }

        //WebRTC

        public async Task AwakenUser(string receiverId, string callerName, string callerAvatar)
        {
            await Clients.User(receiverId).SendAsync("ReceiveAwaken", Context.UserIdentifier, callerName, callerAvatar);
        }

        public async Task ReadyToCall(string callerId, string receiverName, string receiverAvatar, bool hasVideo)
        {
            await Clients.User(callerId).SendAsync("ReceiveReadyCall", Context.UserIdentifier, receiverName, receiverAvatar, hasVideo);
        }

        public async Task StartCall(string receiverId, string callerName, string callerAvatar, bool hasVideo, object signal)
        {
            await Clients.User(receiverId)
            .SendAsync("ReceiveStartCall", Context.UserIdentifier, callerName, callerAvatar, hasVideo, signal);
        }

        public async Task AnswerCall(string callerId, object signal)
        {
            await Clients.User(callerId).SendAsync("ReceiveAnswerCall", signal);
        }

        public async Task EndCall(string collaboratorId)
        {
            await Clients.User(collaboratorId).SendAsync("ReceiveEndCall");
        }

        public async Task VideoChange(string collaboratorId, bool state)
        {
            await Clients.User(collaboratorId).SendAsync("ReceiveVideoChange", state);
        }

        public async Task AudioChange(string collaboratorId, bool state)
        {
            await Clients.User(collaboratorId).SendAsync("ReceiveAudioChange", state);
        }
    }
}