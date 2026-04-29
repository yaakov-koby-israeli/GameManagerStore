using GameStore.Api.Configurations;
using GameStore.Api.Data;
using GameStore.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.AddCustomCors();

// services for data validation (like [required] in Dto)
builder.Services.AddValidation();

// db connection and seeding
builder.AddGameStoreDb();

var app = builder.Build();

app.UseCors();

app.UseStaticFiles();

app.MapGamesEndPoints();

app.MapGenresEndpoints();

app.MigrateDb();

app.Run();
