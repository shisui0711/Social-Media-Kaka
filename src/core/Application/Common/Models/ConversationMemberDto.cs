

namespace Application.Common.Models
{
    public class ConversationMemberDto
    {
        public string Id { get; set; } = null!;

        public string ConversationId { get; set; } = null!;

        public string UserId { get; set; } = null!;

        public ConversationDto Conversation { get; set; } = null!;

        public UserDto User { get; set; } = null!;
    }
}