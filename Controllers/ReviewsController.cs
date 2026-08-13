using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restoran_project.Data;
using restoran_project.Models;

namespace restoran_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Menu)
                .OrderByDescending(r => r.Created)
                .ToListAsync();
        }

        // GET: api/reviews/menu/5
        [HttpGet("menu/{menuId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsForMenu(int menuId)
        {
            return await _context.Reviews
                .Where(r => r.MenuId == menuId)
                .Include(r => r.User)
                .OrderByDescending(r => r.Created)
                .ToListAsync();
        }

        // GET: api/reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Menu)
                .FirstOrDefaultAsync(r => r.ReviewId == id);

            if (review == null)
            {
                return NotFound(new { Message = "review not found" });
            }

            return review;
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview(Review review)
        {
            // Валидација на оценката (од 1 до 5)
            if (review.Rating < 1 || review.Rating > 5)
            {
                return BadRequest(new { Message = "Rating has to be between 1 to 5." });
            }

            review.Created = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.ReviewId }, review);
        }

        // DELETE: api/reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { Message = "review not found." });
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "review is succsessfully deleted." });
        }
    }
}