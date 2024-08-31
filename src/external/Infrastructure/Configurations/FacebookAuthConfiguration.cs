
namespace Infrastructure.Configurations
{
    public class FacebookAuthConfiguration
    {
        public string BaseUrl { get; set; } = null!;
        public string TokenValidationUrl { get; set; } = null!;
        public string UserInfoUrl { get; set; } = null!;
        public string AppId { get; set; } = null!;
        public string AppSecret { get; set; } = null!;
    }
}