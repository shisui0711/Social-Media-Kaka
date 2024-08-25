

using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public partial class User : IdentityUser
    {
        public string DisplayName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? GoogleId { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public DateTime? UsernameLastChange { get; set; }
        public string? ConversationId { get; set; }
        public DateTime Created { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime LastModified { get; set; }
        public string? LastModifiedBy { get; set; }
        public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public virtual ICollection<ConversationMember> ConversationMembers { get; set; } = new List<ConversationMember>();

        public virtual ICollection<FriendRelation> FriendRelationReceivers { get; set; } = new List<FriendRelation>();

        public virtual ICollection<FriendRelation> FriendRelationSenders { get; set; } = new List<FriendRelation>();
        public virtual ICollection<Follow> Followers { get; set; } = new List<Follow>();
        public virtual ICollection<Follow> Followings { get; set; } = new List<Follow>();


        public virtual ICollection<Notification> NotificationIssuers { get; set; } = new List<Notification>();

        public virtual ICollection<Notification> NotificationRecipients { get; set; } = new List<Notification>();

        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}