using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using Serilog.Events;
using Safi.Backend.Infrastructure.Data.Context;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Infrastructure.Data.Repositories;
using Safi.Backend.Modules.Authentication.Services;
using Safi.Backend.Modules.Tickets.Services;
using Safi.Backend.Infrastructure.Data;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/safi-backend-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Add Serilog
builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers(options =>
{
    // Configurações específicas dos controllers
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});

// Add OpenAPI services (nativo do .NET 9)
builder.Services.AddOpenApi();

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
        };
    });

// Add Authorization
builder.Services.AddAuthorization();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Add FluentValidation (comentado temporariamente)
// builder.Services.AddFluentValidationAutoValidation();

// Add Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ITicketRepository, TicketRepository>();

// Add Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    
    // Mapear o endpoint do OpenAPI
    app.MapOpenApi();
    
    // Usar Scalar para interface gráfica do OpenAPI
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded (comentado para não executar sempre)
/*
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Criar banco de dados se não existir
    await context.Database.EnsureCreatedAsync();
    
    // Popular com dados iniciais
    await SeedData.SeedAsync(context);
}
*/

app.Run();
