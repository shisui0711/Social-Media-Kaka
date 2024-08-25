

using Domain.Common;

namespace Domain.Entities
{
    public partial class Bookmark : BaseAuditableEntity
    {

        public string UserId { get; set; } = null!;

        public string PostId { get; set; } = null!;

        public virtual Post Post { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}