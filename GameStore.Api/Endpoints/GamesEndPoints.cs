using GameStore.Api.Data;
using GameStore.Api.Dtos;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Endpoints;

public static class GamesEndPoints
{

  private const long MaxImageBytes = 5 * 1024 * 1024;
  private static readonly string[] AllowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
  private static readonly string[] AllowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const string GetGameEndpointName = "GetGameById";

  public static void MapGamesEndPoints(this WebApplication app)
  {
    
    var group = app.MapGroup("/games");

    // GET /games
    group.MapGet("/", async (GameStoreContext dbContext)
        => await dbContext.Games
                          .Include(game => game.Genre)
                          .Select(game => new GameSummaryDto(
                            game.Id,
                            game.Name,
                            game.Genre!.Name,// the ! is to ignore compiler nullable warning
                            game.Price,
                            game.ReleaseDate
                          ))
                          .AsNoTracking() // tell .net to not keep track of th entites - better performence
                          .ToListAsync());
        
    // GET /games/1
    group.MapGet("/{id}", async (int id, GameStoreContext dbContext) => 
    {
        var game = await dbContext.Games.FindAsync(id);

        return game is null ? Results.NotFound() : Results.Ok(
            new GameDetailsDto(
            game.Id,
            game.Name,
            game.GenreId,
            game.Price,
            game.ReleaseDate
            )
        );
    })
    .WithName(GetGameEndpointName);

    // POST /games
    group.MapPost("/", async (CreateGameDto newGame, GameStoreContext dbContext) =>
    {
        Game game = new()
        {
            Name = newGame.Name,
            GenreId = newGame.GenreId,
            Price = newGame.Price,
            ReleaseDate = newGame.ReleaseDate
        };

        dbContext.Games.Add(game);        
        await dbContext.SaveChangesAsync();

        GameDetailsDto gameDto = new(
            game.Id,
            game.Name,
            game.GenreId,
            game.Price,
            game.ReleaseDate
        );

        return Results.CreatedAtRoute(GetGameEndpointName, new {id = gameDto.Id}, gameDto);
    });

    // PUT /games/1
    group.MapPut("/{id}", async (
        int id, 
        UpdateGameDto updatedGame, 
        GameStoreContext dbContext) =>
    {
        var existingGame = await dbContext.Games.FindAsync(id);

        if(existingGame is null)
        {
            return Results.NotFound();
        }

        existingGame.Name = updatedGame.Name;
        existingGame.GenreId = updatedGame.GenreId;
        existingGame.Price = updatedGame.Price;
        existingGame.ReleaseDate = updatedGame.ReleaseDate;

        await dbContext.SaveChangesAsync();

        return Results.NoContent();
    });

    // DELETE /games/1
    group.MapDelete("/{id}" , async (
        int id,
        GameStoreContext dbContext) =>
    {
        await dbContext.Games
                       .Where(game => game.Id == id)
                       .ExecuteDeleteAsync();

        return Results.NoContent();
    });

    // POST /games/{id}/image
    group.MapPost("/{id:int}/image", async (int id, IFormFile file, GameStoreContext dbContext) =>
    {
        if (file is null || file.Length == 0)
            return Results.BadRequest(new { message = "File is required" });

        if (file.Length > MaxImageBytes)
            return Results.BadRequest(new { message = "File exceeds 5 MB limit" });

        if (!AllowedImageTypes.Contains(file.ContentType))
            return Results.BadRequest(new { message = "Unsupported file type. Allowed: jpeg, png, webp" });

        if (!AllowedImageExtensions.Contains(Path.GetExtension(file.FileName).ToLowerInvariant()))
            return Results.BadRequest(new { message = "Unsupported file extension" });

        var game = await dbContext.Games.FindAsync(id);

        if (game is null)
            return Results.NotFound();

        return Results.Ok(new { message = "Validation passed — file save not yet implemented" });
    });
  }

}
