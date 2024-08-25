

using Domain.Common;

namespace Domain.Entities
{
    public partial class ConversationMember : BaseEntity
{

    public string ConversationId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public virtual Conversation Conversation { get; set; } = null!;

    public virtual User User { get; set; } = null!;
    public DateTime? LastDeleted { get; set; }
}
}