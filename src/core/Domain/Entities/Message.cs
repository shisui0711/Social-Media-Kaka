

using Domain.Common;

namespace Domain.Entities
{
    public partial class Message : BaseAuditableEntity
{

    public string Content { get; set; } = null!;

    public string SenderId { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;

    public string ConversationId { get; set; } = null!;

    public bool Seen { get; set; }

    public virtual Conversation Conversation { get; set; } = null!;
}
}