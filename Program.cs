using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using restoran_project.Data;
using restoran_project.Models;
using restoran_project.Service;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// kontrolerite
builder.Services.AddControllers();

// cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://team-142--delovna2526.reporun.finki.net.mk") 
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials(); // Zadolzitelno za cookies!
        });
});

//  baza
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//  za user
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT tokeni
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // isklucuvame ja default inbound claim mapping, inaku "role"/"nameid"
    // pak se prevrtuvaat vo dolgite ClaimTypes.* URI-ja pri validacija
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        // se poklopuva so kratkite claim keys od UserService (nameid/email/role)
        RoleClaimType = "role",
        NameClaimType = "nameid"
    };

    // Citaj go JWT tokenot od cookie ako postoi
    //options.Events = new JwtBearerEvents
    //{
    //    OnMessageReceived = context =>
    //    {
    //        if (context.Request.Cookies.ContainsKey("X-Access-Token"))
    //        {
    //            context.Token = context.Request.Cookies["X-Access-Token"];
    //        }
    //        return Task.CompletedTask;
    //    }
    //};

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // 1. Прво проверува дали токенот е во Cookie-то "x-access"
            if (context.Request.Cookies.TryGetValue("x-access", out var tokenFromCookie))
            {
                context.Token = tokenFromCookie;
            }
            return Task.CompletedTask;
        }
    };
});

// servisite
builder.Services.AddScoped<UserService>();

// da testiram u swager
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.Migrate();
}

app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();