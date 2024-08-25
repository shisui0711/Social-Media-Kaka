

using Domain.Common;

namespace Application.Common.Models
{
    public class PostMediaDto : BaseEntity
    {
        public string Url { get; set; } = null!;

        public string? PostId { get; set; }
        public string Type { get; set; } = null!;

        public virtual PostDto? Post { get; set; }
    }
}