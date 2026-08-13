using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restoran_project.Data;
using restoran_project.Models;

namespace restoran_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.User)
                .OrderByDescending(o => o.DateCreated)
                .ToListAsync();
        }

        // GET: api/orders/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(string userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.DateCreated)
                .ToListAsync();
        }

        // GET: api/orders/5
        [HttpGet("{orderId}")]
        public async Task<ActionResult<Order>> GetOrder(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Нарачката не е пронајдена." });
            }

            return order;
        }

        // POST: api/orders
        // Креирање на нова нарачка
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(Order order)
        {
            order.DateCreated = DateTime.UtcNow;

            // Пресметуваме вкупна цена доколку фронтендот го прати само списокот на OrderItems
            if (order.OrderItems != null && order.OrderItems.Any())
            {
                decimal total = 0;
                foreach (var item in order.OrderItems)
                {
                    total += item.Price * item.Quantity;
                }
                order.Price = total;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { orderId = order.OrderId }, order);
        }

        // PUT: api/orders/5/status?newStatus=Accepted
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, OrderStatus newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound(new { Message = "Нарачката не е пронајдена." });
            }

            order.OrderStatus = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Статусот на нарачката е успешно променет.", Status = order.OrderStatus.ToString() });
        }

        // DELETE: api/orders/5
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound(new { Message = "Нарачката не е пронајдена." });
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Нарачката е избришана." });
        }
    }
}