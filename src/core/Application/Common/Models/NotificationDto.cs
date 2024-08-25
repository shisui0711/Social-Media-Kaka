

using Domain.Common;

namespace Application.Common.Models
{
    public class NotificationDto : BaseAuditableEntity
    {
        public string? IssuerId { get; set; }

        public string? PostId { get; set; }

        public bool Seen { get; set; }

        public string RecipientId { get; set; } = null!;
        public string Type { get; set; } = null!;
        public UserDto? Issuer { get; set; }
        public PostDto? Post { get; set; }
    }
}