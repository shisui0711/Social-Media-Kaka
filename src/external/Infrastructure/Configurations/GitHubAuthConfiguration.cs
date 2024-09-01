

namespace Infrastructure.Configurations
{
    public class GitHubAuthConfiguration
    {
        public string BaseUrl { get; set; } = null!;
        public string TokenValidationUrl { get; set; } = null!;
        public string UserInfoUrl { get; set; } = null!;
        public string ClientId { get; set; } = null!;
        public string ClientSecret { get; set; } = null!;
        public string AppName { get; set; } = null!;
    }
}