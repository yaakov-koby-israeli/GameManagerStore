using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

// represent a session between API and db
// use to query and save instances of entities in the db
public class GameStoreContext(DbContextOptions<GameStoreContext> options) 
  : DbContext(options)
{
  public DbSet<Game> Games => Set<Game>();

  public DbSet<Genre> Genre => Set<Genre>();
}
