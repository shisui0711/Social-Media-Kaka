

using Domain.Common;
using Domain.Entities;

namespace Application.Common.Models
{
    public class UserDto : BaseEntity
    {
    public string UserName { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime UserNameLastChange { get; set; }
    public ICollection<FollowDto> Followers { get; set; } = new List<FollowDto>();
    public ICollection<FollowDto> Followings { get; set; } = new List<FollowDto>();
    public ICollection<FriendRelation> FriendRelationSenders { get; set; } = new List<FriendRelation>();
    public ICollection<FriendRelation> FriendRelationReceivers { get; set; } = new List<FriendRelation>();
    public ICollection<PostDto> Posts { get; set; } = new List<PostDto>();
    }
}