

using Domain.Common;

namespace Application.Common.Models
{
    public class ConversationDto : BaseAuditableEntity
    {

        public string? Title { get; set; }

        public bool IsGroup { get; set; }

        public virtual ICollection<ConversationMemberDto> ConversationMembers { get; set; } = new List<ConversationMemberDto>();

        public virtual ICollection<MessageDto> Messages { get; set; } = new List<MessageDto>();
    }
}