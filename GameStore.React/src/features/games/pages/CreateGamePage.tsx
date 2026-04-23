import { Link, useNavigate } from 'react-router-dom';
import { useCreateGame } from '../api/gamesApi';
import { GameForm } from '../components/GameForm';
import type { GameFormValues } from '../components/GameForm';

export function CreateGamePage() {
  const navigate = useNavigate();
  const { mutate: createGame, isPending } = useCreateGame();

  function handleSubmit(data: GameFormValues) {
    createGame(data, {
      onSuccess: (newGame) => {
        navigate(`/games/${newGame.id}`);
      },
    });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link
          to="/games"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Games
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add Game</h1>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <GameForm onSubmit={handleSubmit} isPending={isPending} submitLabel="Add Game" />
      </div>
    </div>
  );
}
