using System.Text.Json.Serialization;

namespace restoran_project.Models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        public int MenuId { get; set; }
        public Menu? MenuItem { get; set; }
        
        public int OrderId { get; set;  }

        [JsonIgnore]
        public Order? Order { get; set; }
        public int Quantity { get; set;  }

        public decimal Price { get; set; }

    }
}
