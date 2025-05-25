

namespace Domain.Entities
{
    public partial class SearchLog
    {
        public string KeyWord { get; set; } = null!;
        public int SearchCount { get; set; } = 1;
    }
}