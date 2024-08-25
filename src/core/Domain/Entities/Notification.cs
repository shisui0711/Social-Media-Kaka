

using Domain.Common;

namespace Domain.Entities
{
    public partial class Notification : BaseAuditableEntity
    {
        public string? IssuerId { get; set; }

        public string? PostId { get; set; }
        public string? CommentId { get; set; }

        public bool Seen { get; set; }

        public string RecipientId { get; set; } = null!;
        public string Type { get; set; } = null!;

        public virtual User? Issuer { get; set; }

        public virtual Post? Post { get; set; }
        public virtual Comment? Comment { get; set; }

        public virtual User Recipient { get; set; } = null!;
    }
}