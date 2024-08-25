

namespace Infrastructure.Configurations
{
    public class JwtConfiguration
    {
        public string Key { get; set; } = null!;
        public string Audience { get; set; } = null!;
        public string Issuer { get; set; } = null!;
        public int LifeTimeStamp { get; set; }
        public int RefreshTimeStamp { get; set; }
    }
}