
using Domain.Common;

namespace Application.Common.Models
{
    public class BookmarkDto : BaseAuditableEntity
    {
        public string UserId { get; set; } = null!;

        public string PostId { get; set; } = null!;
    }
}