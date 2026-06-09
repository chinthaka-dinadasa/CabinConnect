using CabinConnect.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var corsOriginsRaw = builder.Configuration["CORS_ALLOWED_ORIGINS"]
    ?? throw new InvalidOperationException(
        "Required environment variable 'CORS_ALLOWED_ORIGINS' is not set.");

var jwtSecret = builder.Configuration["SUPABASE_JWT_SECRET"]
    ?? throw new InvalidOperationException(
        "Required environment variable 'SUPABASE_JWT_SECRET' is not set.");

var databaseUrl = builder.Configuration["DATABASE_URL"]
    ?? throw new InvalidOperationException(
        "Required environment variable 'DATABASE_URL' is not set.");

var allowedOrigins = corsOriginsRaw
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidAlgorithms = new List<string> { SecurityAlgorithms.HmacSha256 },
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };
    });

builder.Services.AddDbContext<CabinConnectDbContext>(options =>
    options.UseNpgsql(databaseUrl));

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
