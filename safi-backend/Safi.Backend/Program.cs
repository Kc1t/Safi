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
using Safi.Backend.Modules.AI.Services;
using Safi.Backend.Infrastructure.Data;
using Safi.Backend.Infrastructure.Middleware;

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

// Add SignalR
builder.Services.AddSignalR();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation removido temporariamente - não é essencial para funcionamento básico
// builder.Services.AddFluentValidationAutoValidation();
// builder.Services.AddFluentValidationClientsideAdapters();
// Validators comentados temporariamente - dependem do FluentValidation
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.Authentication.DTOs.RefreshTokenRequest>, Safi.Backend.Modules.Authentication.Validators.RefreshTokenRequestValidator>();
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.Tickets.DTOs.PublicTicketRequest>, Safi.Backend.Modules.Tickets.Validators.PublicTicketRequestValidator>();
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.Tickets.DTOs.CreateTicketRequest>, Safi.Backend.Modules.Tickets.Validators.CreateTicketRequestValidator>();
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.Tickets.DTOs.UpdateTicketRequest>, Safi.Backend.Modules.Tickets.Validators.UpdateTicketRequestValidator>();
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.Tickets.DTOs.TicketListRequest>, Safi.Backend.Modules.Tickets.Validators.TicketListRequestValidator>();
// Validators do AI também comentados temporariamente
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.AI.DTOs.AIAnalysisRequest>, Safi.Backend.Modules.AI.Validators.AIAnalysisRequestValidator>();
// builder.Services.AddScoped<FluentValidation.IValidator<Safi.Backend.Modules.AI.DTOs.AIResponseRequest>, Safi.Backend.Modules.AI.Validators.AIResponseRequestValidator>();

// Add Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ITicketRepository, TicketRepository>();

// Add Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IChatService, ChatService>();
// FAQ Service - Geração de FAQ com IA Gemini
builder.Services.AddScoped<IFaqService, Safi.Backend.Modules.FAQ.Services.FaqService>();

// Add HttpClient for AI Service
builder.Services.AddHttpClient<IAIService, AIService>();
// Add HttpClient for FAQ Service - timeout de 30 segundos
builder.Services.AddHttpClient<IFaqService, Safi.Backend.Modules.FAQ.Services.FaqService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
    
    // CORS específico para SignalR e frontend local
    options.AddPolicy("SignalRCors", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "http://localhost:3000",
                "http://localhost:5080",
                "https://localhost:5080")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
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
    
    // Scalar personalizado com configuração completa
    app.MapGet("/scalar-custom", () => Results.File("wwwroot/scalar-custom.html", "text/html"));
}

app.UseHttpsRedirection();

// CORS deve vir antes de UseAuthentication
app.UseCors("SignalRCors");

// Middleware para endpoints públicos (deve vir antes da autenticação)
app.UseMiddleware<PublicEndpointMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR Hub
app.MapHub<Safi.Backend.Modules.AI.Hubs.ChatHub>("/chatHub");

// Ensure database is created and seeded (habilitado temporariamente)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Criar banco de dados se não existir
    await context.Database.EnsureCreatedAsync();
    
    // Popular com dados iniciais
    await SeedData.SeedAsync(context);
}

app.Run();
