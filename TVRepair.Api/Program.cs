using TVRepair.Api.model;
using Microsoft.EntityFrameworkCore;
using TVRepair.Api.data;
using Microsoft.AspNetCore.Identity;
using Stripe;
using TVRepair.Api.services;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy
            .WithOrigins(
    "http://localhost:5173",
    "http://localhost:5174"
)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});


builder.Services.AddDbContext<TVRepairDBContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IRepairOrderService, RepairOrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<
    IUserAuthenticationService,
    UserAuthenticationService>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>().AddEntityFrameworkStores<TVRepairDBContext>();

builder.Services.Configure<IdentityOptions>(options =>
{
    // Username rules
    options.User.AllowedUserNameCharacters = string.Empty;
    options.User.RequireUniqueEmail = false;

    // Password rules
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 1;
    options.Password.RequiredUniqueChars = 0;

    // Login rules
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedPhoneNumber = false;

    // Lockout
    options.Lockout.AllowedForNewUsers = false;
});

var stripeSecretKey =
    builder.Configuration["Stripe:SecretKey"];

if (string.IsNullOrWhiteSpace(stripeSecretKey))
{
    throw new InvalidOperationException(
        "Stripe:SecretKey is missing from appsettings.json.");
}

builder.Services.AddSingleton<IStripeClient>(
    new StripeClient(stripeSecretKey)
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactApp");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGroup("/api/auth")
   .MapIdentityApi<ApplicationUser>();

app.Run();
