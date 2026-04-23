import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../api/gamesApi';
import { useUpdateGame } from '../api/gamesApi';
import { GameForm } from '../components/GameForm';
import type { GameFormValues } from '../components/GameForm';

export function EditGamePage() {
  const { id } = useParams<{ id: string }>();
  const gameId = id !== undefined ? Number(id) : NaN;

  const navigate = useNavigate();
  const { data: game, isLoading, isError } = useGame(gameId);
  const { mutate: updateGame, isPending } = useUpdateGame(gameId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-muted-foreground">
        Loading game…
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-destructive">
        Game not found or the backend is unreachable.
      </div>
    );
  }

  // Map GameDetailsDto → GameFormValues.
  // Note: GameDetailsDto.genre is genreId (int), not the genre name.
  const defaultValues: GameFormValues = {
    name: game.name,
    genreId: game.genre,
    price: game.price,
    releaseDate: game.releaseDate,
  };

  function handleSubmit(data: GameFormValues) {
    updateGame(data, {
      onSuccess: () => {
        navigate(`/games/${gameId}`);
      },
    });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/games/${gameId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {game.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Edit Game</h1>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <GameForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
