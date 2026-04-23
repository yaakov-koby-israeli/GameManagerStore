export interface GameSummaryDto {
  id: number;
  name: string;
  genre: string; // resolved genre name from GET /games
  price: number;
  releaseDate: string;
}

export interface GameDetailsDto {
  id: number;
  name: string;
  genre: number; // genreId — cross-reference GET /genres to get the name
  price: number;
  releaseDate: string;
}

// Shared shape for POST /games and PUT /games/:id
export interface CreateGameDto {
  name: string;
  genreId: number;
  price: number;
  releaseDate: string;
}

// PUT /games/:id — identical fields to CreateGameDto
export type UpdateGameDto = CreateGameDto;
