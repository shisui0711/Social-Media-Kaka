

using Domain.Common;

namespace Application.Common.Models
{
    public class MessageDto : BaseAuditableEntity
    {

        public string Content { get; set; } = null!;

        public string SenderId { get; set; } = null!;

        public string ReceiverId { get; set; } = null!;

        public string ConversationId { get; set; } = null!;

        public bool Seen { get; set; }
        public ConversationDto Conversation { get; set; } = null!;
    }
}