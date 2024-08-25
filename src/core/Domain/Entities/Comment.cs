

using Domain.Common;

namespace Domain.Entities
{
    public partial class Comment : BaseAuditableEntity
{

    public string Content { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string PostId { get; set; } = null!;

    public string? ParentId { get; set; } = null!;
    public virtual ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Comment? ParentComment { get; set; } = null!;

    public virtual ICollection<Comment> ChildrenComment { get; set; } = new List<Comment>();

    public virtual Post Post { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
}