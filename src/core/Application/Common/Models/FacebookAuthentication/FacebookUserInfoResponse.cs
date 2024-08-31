
using Newtonsoft.Json;

namespace Application.Common.Models.FacebookAuthentication
{
    public class FacebookUserInfoResponse
    {
        [JsonProperty("id")]
        public string Id { get; set; } = null!;

        [JsonProperty("name")]
        public string Name { get; set; } = null!;

        [JsonProperty("first_name")]
        public string FirstName { get; set; } = null!;

        [JsonProperty("last_name")]
        public string LastName { get; set; } = null!;

        [JsonProperty("email")]
        public string Email { get; set; } = null!;

        [JsonProperty("picture")]
        public Picture Picture { get; set; } = null!;
    }

    public class Picture
    {
        [JsonProperty("data")]
        public Data Data { get; set; } = null!;
    }

    public class Data
    {
        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("is_silhouette")]
        public bool IsSilhouette { get; set; }

        [JsonProperty("url")]
        public Uri Url { get; set; } = null!;

        [JsonProperty("width")]
        public long Width { get; set; }
    }
}