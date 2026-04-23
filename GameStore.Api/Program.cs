using GameStore.Api.Data;
using GameStore.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [])
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// services for data validation (like [required] in Dto)
builder.Services.AddValidation();

// db connection and seeding
builder.AddGameStoreDb();

var app = builder.Build();

app.UseCors();

app.MapGamesEndPoints();

app.MapGenresEndpoints();

app.MigrateDb();

app.Run();
