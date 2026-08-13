using System.ComponentModel.DataAnnotations;

namespace restoran_project.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        
    }
}

