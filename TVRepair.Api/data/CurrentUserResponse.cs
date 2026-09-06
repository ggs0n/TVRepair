using System.Text.Json.Serialization;

namespace TVRepair.Api.data
{
    public class CurrentUserResponse
    {
        public string Id { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("customertype")]
        public string? CustomerType { get; set; }

        public string? Area { get; set; }
    }
}
