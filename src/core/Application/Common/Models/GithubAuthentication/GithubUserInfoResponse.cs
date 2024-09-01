
using Newtonsoft.Json;

namespace Application.Common.Models.GithubAuthentication
{
    public class GithubUserInfoResponse
    {
        [JsonProperty("login")]
        public string Login { get; set; } = null!;
        [JsonProperty("id")]
        public string Id { get; set; } = null!;
        [JsonProperty("avatar_url")]
        public string AvatarUrl { get; set; } = null!;
        [JsonProperty("name")]
        public string Name { get; set; } = null!;
        [JsonProperty("location")]
        public string Location { get; set; } = null!;
        [JsonProperty("email")]
        public string Email { get; set; } = null!;
        [JsonProperty("bio")]
        public string Bio { get; set; } = null!;
    }
}