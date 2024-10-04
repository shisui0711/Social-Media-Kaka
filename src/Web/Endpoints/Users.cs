

using Application.Common.Models;
using Application.Users.Commands.AddFriend;
using Application.Users.Commands.ChangeBirthDay;
using Application.Users.Commands.FollowUser;
using Application.Users.Commands.UnFollowUser;
using Application.Users.Commands.UnFriend;
using Application.Users.Commands.UpdateMyAvatar;
using Application.Users.Commands.UpdateMyProfile;
using Application.Users.Queries.GetFollowInfo;
using Application.Users.Queries.GetFriendInfo;
using Application.Users.Queries.GetMyFriendByName;
using Application.Users.Queries.GetMyFriendsWithPagination;
using Application.Users.Queries.GetMyInfo;
using Application.Users.Queries.GetReceivedFriendWithPagination;
using Application.Users.Queries.GetSendedFriendWithPagination;
using Application.Users.Queries.GetSuggestionFollow;
using Application.Users.Queries.GetUserInfo;
using Application.Users.Queries.GetUserInfoById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Users : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(GetMyInfo,"me")
                .MapGet(GetUserInfo,"info")
                .MapGet(GetUserInfoById,"info/{id}")
                .MapGet(GetFollowInfo,"follow/{id}")
                .MapGet(GetMyFriendByName,"friends")
                .MapGet(GetMyFriendsWithPagination,"friends/all")
                .MapGet(GetSendedFriendWithPagination,"friends/sended")
                .MapGet(GetReceivedFriendWithPagination,"friends/received")
                .MapGet(GetSuggestionFollow,"suggestion")
                .MapPost(FollowUser,"follow/{id}")
                .MapPost(UpdateMyAvatar,"avatar")
                .MapPost(UpdateMyProfile,"profile")
                .MapPost(ChangeBirthDay,"change-birthday")
                .MapDelete(UnFollowUser,"follow/{id}")
                .MapPost(AddFriend,"friends/{id}")
                .MapGet(GetFriendInfo,"friends/{id}")
                .MapDelete(UnFriend,"friends/{id}");
        }

        public Task<bool> ChangeBirthDay(ISender sender, [FromBody] ChangeBirthDayCommand command)
        => sender.Send(command);

        public Task<MyUserDto> GetMyInfo(ISender sender , [AsParameters] GetMyInfoQuery query)
        => sender.Send(query);

        public Task<UserDto> GetUserInfo(ISender sender, [AsParameters] GetUserInfoQuery query)
        => sender.Send(new GetUserInfoQuery(){UserName = Uri.UnescapeDataString(query.UserName)});

        public Task<UserDto> GetUserInfoById(ISender sender, [FromRoute] string id)
        => sender.Send(new GetUserInfoByIdQuery(){UserId = id});

        public Task<FollowInfo> GetFollowInfo(ISender sender, [FromRoute] string id)
        => sender.Send(new GetFollowInfoQuery(){UserId = id});

        public Task<IEnumerable<UserDto>> GetMyFriendByName
        (ISender sender, [AsParameters] GetMyFriendByNameQuery query)
        => sender.Send(query);

        public Task<IEnumerable<UserDto>> GetSuggestionFollow
        (ISender sender, [AsParameters] GetSuggestionFollowQuery query)
        => sender.Send(query);

        public Task FollowUser(ISender sender, [FromRoute] string id)
        => sender.Send(new FollowUserCommand(){UserId = id});

        public Task UnFollowUser(ISender sender, [FromRoute] string id)
        => sender.Send(new UnFollowUserCommand(){UserId = id});

        public Task UpdateMyAvatar(ISender sender, [FromBody] UpdateMyAvatarCommand command)
        => sender.Send(command);

        public Task<UserDto> UpdateMyProfile(ISender sender, [FromBody] UpdateMyProfileCommand command)
        => sender.Send(command);

        public Task AddFriend(ISender sender, [FromRoute] string id)
        => sender.Send(new AddFriendCommand(){UserId = id});

        public Task UnFriend(ISender sender, [FromRoute] string id)
        => sender.Send(new UnFriendCommand(){UserId = id});

        public Task<FriendInfo> GetFriendInfo(ISender sender,[FromRoute] string id)
        => sender.Send(new GetFriendInfoQuery(){UserId = id});

        public Task<PaginatedList<UserDto>> GetMyFriendsWithPagination
        (ISender sender, [AsParameters] GetMyFriendsWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<UserDto>> GetSendedFriendWithPagination
        (ISender sender, [AsParameters] GetSendedFriendWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<UserDto>> GetReceivedFriendWithPagination
        (ISender sender, [AsParameters] GetReceivedFriendWithPaginationQuery query) => sender.Send(query);
    }
}