

using Domain.Common;

namespace Domain.Entities
{
    public partial class Follow : BaseEntity
{

    public string FollowerId { get; set; } = null!;

    public string FollowingId { get; set; } = null!;

    public virtual User Follower { get; set; } = null!;

    public virtual User Following { get; set; } = null!;
}
}