using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using restoran_project.Models;
using restoran_project.Service;

namespace restoran_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _userService.RegisterUserAsync(dto);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Успешна регистрација!" });
        }

        // Login со Cookie
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // 1. Повикај го UserService за да го провери корисникот и да генерира токен
            var token = await _userService.LoginUserAsync(model.Email, model.Password);

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Грешен email или лозинка." });
            }

            // 2. Подесување на опциите за Cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,                  // Спречува XSS напади
                Secure = true,                    // Задолжително за HTTPS
                SameSite = SameSiteMode.Strict,   // Заштита од CSRF
                Expires = DateTime.UtcNow.AddDays(7)
            };

            // 3. Запишување на токенот во Cookie
            Response.Cookies.Append("X-Access-Token", token, cookieOptions);

            return Ok(new { message = "Успешна најава!" });
        }

        // Враќа податоци за најавениот корисник
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("nameid")?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                        ?? User.FindFirst("email")?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
                       ?? User.FindFirst("role")?.Value;

            return Ok(new
            {
                id = userId,
                email = email,
                role = role
            });
        }

        // Logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Delete("X-Access-Token", cookieOptions);
            return Ok(new { message = "Успешна одјава!" });
        }

        // Само за Admin
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}