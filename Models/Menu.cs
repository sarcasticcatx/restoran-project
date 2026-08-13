using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace restoran_project.Models
{
    public class Menu
    {
        [Key]
        public int MenuId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string? PictureOfFood { get; set; }

        // Foreign Key кон Category
        [Required]
        public int CategoryId { get; set; }

        
        [JsonIgnore]
        public Category? Category { get; set; }
    }
}