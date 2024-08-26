
using System.Collections.Concurrent;
using System.Security.Claims;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace WebApi.Hubs
{
    public class ProjectHub : Hub
    {
        private static RoomManager roomManager = new RoomManager();
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProjectHub(IMapper mapper, IApplicationDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

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
            roomManager.DeleteRoom(Context.ConnectionId);
            _ = NotifyRoomInfoAsync(false);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendComment(CommentDto comment, string postId)
        {
            await Clients.Group(postId).SendAsync("ReceiveComment", comment);
        }

        public async Task SendFriendRequest(string userId)
        {
            var currentUserId = Context.User?.Claims
                .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != null && UserIdToConnectionIdMap.TryGetValue(userId, out var connectionId))
            {
                UserDto user = await _context.Users.AsNoTracking().Where(x => x.Id == currentUserId)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstAsync();
                await Clients.Client(connectionId).SendAsync("ReceiveFriendRequest", user);
            }
        }

        public async Task SendCancelFriend(string userId)
        {
            var currentUserId = Context.User?.Claims
                .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != null && UserIdToConnectionIdMap.TryGetValue(userId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveCancelFriend", currentUserId);
            }
        }
        public async Task SendMessage(MessageDto message)
        {
            await Clients.Group(message.ConversationId).SendAsync("ReceiveMessage", message);
        }

        public bool IsUserConnected(string userId)
        {
            return UserIdToConnectionIdMap.ContainsKey(userId);
        }

        public async Task JoinGroup(string conversationId)
        {
            var userId = Context.User?.Claims
                .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId != null && UserIdToConnectionIdMap.TryGetValue(userId, out var connectionId))
            {
                await Groups.AddToGroupAsync(connectionId, conversationId);
            }
        }

        public async Task LeaveGroup(string conversationId)
        {
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

        //Method for WebRTC
        public async Task CreateRoom(string name)
        {
            RoomInfo? roomInfo = roomManager.CreateRoom(Context.ConnectionId, name);
            if (roomInfo != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, roomInfo.RoomId);
                await Clients.Caller.SendAsync("roomCreated", roomInfo.RoomId);
                await NotifyRoomInfoAsync(false);
            }
            else
            {
                await Clients.Caller.SendAsync("roomError", "error occurred when creating a new room.");
            }
        }
        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Caller.SendAsync("roomJoined", roomId);
            await Clients.Group(roomId).SendAsync("roomReady");

            //remove the room from room list.
            if (int.TryParse(roomId, out int id))
            {
                roomManager.DeleteRoom(id);
                await NotifyRoomInfoAsync(false);
            }
        }
        public async Task LeaveRoom(string roomId)
        {
            await Clients.Group(roomId).SendAsync("roomLeave");
        }
        public async Task GetRoomInfo()
        {
            await NotifyRoomInfoAsync(true);
        }
        public async Task SendSignaling(string roomId, object signaling)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveSignaling", signaling);
        }
        public async Task NotifyRoomInfoAsync(bool notifyOnlyCaller)
        {
            List<RoomInfo> roomInfos = roomManager.GetAllRoomInfo();
            var list = from room in roomInfos
                    select new
                    {
                        RoomId = room.RoomId,
                        Name = room.Name,
                        Button = "<button class=\"joinButton\">Join!</button>"
                    };
            var data = JsonConvert.SerializeObject(list);

            if (notifyOnlyCaller)
            {
                await Clients.Caller.SendAsync("updateRoom", data);
            }
            else
            {
                await Clients.All.SendAsync("updateRoom", data);
            }
        }
    }

    public class RoomManager
    {
        private int nextRoomId;
        private ConcurrentDictionary<int, RoomInfo> rooms;

        public RoomManager()
        {
            nextRoomId = 1;
            rooms = new ConcurrentDictionary<int, RoomInfo>();
        }

        public RoomInfo? CreateRoom(string connectionId, string name)
        {
            rooms.TryRemove(nextRoomId, out _);

            //create new room info
            var roomInfo = new RoomInfo
            {
                RoomId = nextRoomId.ToString(),
                Name = name,
                HostConnectionId = connectionId
            };
            bool result = rooms.TryAdd(nextRoomId, roomInfo);

            if (result)
            {
                nextRoomId++;
                return roomInfo;
            }
            else
            {
                return null;
            }
        }

        public void DeleteRoom(int roomId)
        {
            rooms.TryRemove(roomId, out _);
        }

        public void DeleteRoom(string connectionId)
        {
            int? correspondingRoomId = null;
            foreach (var pair in rooms)
            {
                if (pair.Value.HostConnectionId.Equals(connectionId))
                {
                    correspondingRoomId = pair.Key;
                }
            }

            if (correspondingRoomId.HasValue)
            {
                rooms.TryRemove(correspondingRoomId.Value, out _);
            }
        }

        public List<RoomInfo> GetAllRoomInfo()
        {
            return rooms.Values.ToList();
        }
    }

    public class RoomInfo
    {
        public string RoomId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string HostConnectionId { get; set; } = null!;
    }
}