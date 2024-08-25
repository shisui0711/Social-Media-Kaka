

using Domain.Common;

namespace Domain.Entities
{
    public class CommentLike : BaseEntity
    {
        public string UserId { get; set; } = null!;

        public string CommentId { get; set; } = null!;

        public virtual Comment Comment { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}