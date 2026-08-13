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

        // register
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

        // login
        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var token = await _userService.LoginUserAsync(email, password);

            if (token == null)
            {
                return BadRequest("Грешен email или лозинка.");
            }

            
            return Ok(new { token });
        }

        // samo dostapno za adnimot
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}