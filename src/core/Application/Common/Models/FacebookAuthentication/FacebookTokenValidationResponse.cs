using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Application.Common.Models.FacebookAuthentication
{
    public class FacebookTokenValidationResponse
    {
        [JsonProperty("data")]
        public FacebookTokenValidationData Data { get; set; } = null!;
    }
    public class FacebookTokenValidationData
    {
        [JsonProperty("app_id")]
        public string AppId { get; set; } = null!;

        [JsonProperty("type")]
        public string Type { get; set; } = null!;

        [JsonProperty("application")]
        public string Application { get; set; } = null!;

        [JsonProperty("data_access_expires_at")]
        public long DataAccessExpiresAt { get; set; }

        [JsonProperty("expires_at")]
        public long ExpiresAt { get; set; }

        [JsonProperty("is_valid")]
        public bool IsValid { get; set; }

        [JsonProperty("metadata")]
        public Metadata Metadata { get; set; } = null!;

        [JsonProperty("scopes")]
        public string[] Scopes { get; set; } = null!;

        [JsonProperty("user_id")]
        public string UserId { get; set; } = null!;
    }

    public class Metadata
    {
        [JsonProperty("auth_type")]
        public string AuthType { get; set; } = null!;
    }
}