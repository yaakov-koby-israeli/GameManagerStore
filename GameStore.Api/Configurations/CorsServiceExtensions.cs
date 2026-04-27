namespace GameStore.Api.Configurations;

public static class CorsServiceExtensions
{
  public static void AddCustomCors(this WebApplicationBuilder builder)
  {
    builder.Services.AddCors(options =>
    {
      options.AddDefaultPolicy(policy =>
          policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [])
                .AllowAnyHeader()
                .AllowAnyMethod());
    });
  }
}
