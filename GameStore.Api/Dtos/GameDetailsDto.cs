namespace GameStore.Api.Dtos;

// Dto to return msg to client

public record GameDetailsDto(
  int Id,
  string Name,
  int Genre,
  decimal Price,
  DateOnly ReleaseDate
);
