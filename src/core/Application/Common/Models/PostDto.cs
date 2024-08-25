
using Domain.Common;

namespace Application.Common.Models
{
    public class PostDto : BaseAuditableEntity
    {
        public string Content { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public UserDto User { get; set; } = null!;
        public ICollection<PostMediaDto> Attachments { get; set; } = new List<PostMediaDto>();
        public ICollection<LikeDto> Likes { get; set; } = new List<LikeDto>();
        public ICollection<BookmarkDto> Bookmarks { get; set; } = new List<BookmarkDto>();
        public ICollection<CommentDto> Comments { get; set; } = new List<CommentDto>();
        public virtual ICollection<NotificationDto> Notifications { get; set; } = new List<NotificationDto>();
    }
}