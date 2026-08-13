using System.Text.Json.Serialization;

namespace restoran_project.Models
{
//  0 za cash, 1 za card
    public enum PaymentMethod 
    {
        Cash,
        Card
    }

// 0 za accepted, 1 za inmaking, 2 za delivered, 3 za canceled
    public enum OrderStatus
    {
        Accepted,
        InMaking,
        Delivered,
        Canceled
    }
    public class Order
    {
        public int OrderId { get; set; }
        public string UserId { get; set; } = string.Empty;

        [JsonIgnore]
        public User? User { get; set; }
        public DateTime DateCreated {  get; set; }
        public decimal Price { get; set;  }
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Accepted;
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
