

using Domain.Common;

namespace Domain.Entities
{
    public partial class Post : BaseAuditableEntity
    {

        public string Content { get; set; } = null!;

        public string UserId { get; set; } = null!;

        public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        public virtual ICollection<PostMedia> Attachments { get; set; } = new List<PostMedia>();
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();


        public virtual User User { get; set; } = null!;
    }
}