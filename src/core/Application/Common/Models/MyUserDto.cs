
namespace Application.Common.Models
{
    public class MyUserDto
    {
        public string Id { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public string Email { get; set; } = null!;
        public bool EmailConfirmed { get; set; }
        public DateTime? BirthDay { get; set; }
        public DateTime? UserNameLastChange { get; set; }
        public DateTime? EmailLastChange { get; set; }
        public DateTime? BirthDayLastChange { get; set; }
        public string? PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTime Created { get; set; }
        public ICollection<FollowDto> Followers { get; set; } = new List<FollowDto>();
        public ICollection<FollowDto> Followings { get; set; } = new List<FollowDto>();
        public ICollection<PostDto> Posts { get; set; } = new List<PostDto>();
    }
}