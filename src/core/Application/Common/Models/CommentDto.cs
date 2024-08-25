
using Domain.Common;

namespace Application.Common.Models
{
    public class CommentDto : BaseAuditableEntity
    {

        public string Content { get; set; } = null!;

        public string UserId { get; set; } = null!;

        public string PostId { get; set; } = null!;
        public string? ParentId { get; set; } = null!;

        public virtual CommentDto? ParentComment { get; set; } = null!;


        public UserDto User { get; set; } = null!;
        public virtual ICollection<CommentLikeDto> CommentLikes { get; set; } = new List<CommentLikeDto>();

        public virtual ICollection<NotificationDto> Notifications { get; set; } = new List<NotificationDto>();
        public virtual ICollection<CommentDto> ChildrenComment { get; set; } = new List<CommentDto>();

    }
}