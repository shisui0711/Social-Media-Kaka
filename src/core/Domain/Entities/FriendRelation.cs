

using Domain.Common;

namespace Domain.Entities
{
    public partial class FriendRelation : BaseAuditableEntity
    {

        public string SenderId { get; set; } = null!;

        public string ReceiverId { get; set; } = null!;

        public bool Accepted { get; set; }

        public virtual User Receiver { get; set; } = null!;

        public virtual User Sender { get; set; } = null!;
    }
}