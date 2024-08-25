

using Domain.Common;

namespace Domain.Entities
{
    public partial class PostMedia : BaseAuditableEntity
    {

        public string Url { get; set; } = null!;

        public string? PostId { get; set; }
        public string Type { get; set; } = null!;

        public virtual Post? Post { get; set; }
    }
}