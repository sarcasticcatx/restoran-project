using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restoran_project.Data;
using restoran_project.Models;

namespace restoran_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MenusController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/menus
        // Враќа ги сите менија заедно со името на категоријата
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Menu>>> GetMenus()
        {
            return await _context.Menus
                .Include(m => m.Category)
                .ToListAsync();
        }

        // GET: api/menus/5
        [HttpGet("{menuId}")]
        public async Task<ActionResult<Menu>> GetMenu(int menuId)
        {
            var menu = await _context.Menus
                .Include(m => m.Category)
                .FirstOrDefaultAsync(m => m.MenuId == menuId);

            if (menu == null)
            {
                return NotFound(new { Message = "Јадењето не е пронајдено." });
            }

            return menu;
        }

        // GET: api/menus/category/2
        // Ова е супер за фронтендот за филтрирање по категорија (на пр. сите пијалоци)
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Menu>>> GetMenusByCategory(int categoryId)
        {
            return await _context.Menus
                .Where(m => m.CategoryId == categoryId)
                .Include(m => m.Category)
                .ToListAsync();
        }

        // POST: api/menus
        [HttpPost]
        public async Task<ActionResult<Menu>> CreateMenu(Menu menu)
        {
            // Проверка дали постои категоријата пред да се сними
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == menu.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { Message = $"Категорија со CategoryId={menu.CategoryId} не постои." });
            }

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenu), new { menuId = menu.MenuId }, menu);
        }

        // PUT: api/menus/5
        [HttpPut("{menuId}")]
        public async Task<IActionResult> UpdateMenu(int menuId, Menu menu)
        {
            if (menuId != menu.MenuId)
            {
                return BadRequest(new { Message = "ИД-то во URL-то и во телото не се совпаѓаат." });
            }

            _context.Entry(menu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Menus.Any(e => e.MenuId == menuId))
                {
                    return NotFound(new { Message = "Јадењето не постои." });
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/menus/5
        [HttpDelete("{menuId}")]
        public async Task<IActionResult> DeleteMenu(int menuId)
        {
            var menu = await _context.Menus.FindAsync(menuId);
            if (menu == null)
            {
                return NotFound(new { Message = "Јадењето не е пронајдено." });
            }

            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Јадењето е успешно избришано." });
        }
    }
}