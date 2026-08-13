using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace restoran_project.Models
{
    public class Review
    {
        public int ReviewId { get; set; }

        public string UserId { get; set; } = string.Empty;

        [JsonIgnore] 
        public User? User { get; set; }

        public int MenuId { get; set; }

        [JsonIgnore]
        public Menu? Menu { get; set; }

        public int Rating { get; set; } // на пр. од 1 до 5
        public string Comment { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}