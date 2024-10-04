

using Domain.Common;

namespace Domain.Entities
{
    public partial class Conversation : BaseAuditableEntity
    {

        public string? Title { get; set; }

        public virtual ICollection<ConversationMember> ConversationMembers { get; set; } = new List<ConversationMember>();

        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    }

}