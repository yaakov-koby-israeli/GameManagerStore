import { useParams } from 'react-router-dom';
import { useGame } from '../api/gamesApi';
import { GameDetail } from '../components/GameDetail';

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const gameId = id !== undefined ? Number(id) : NaN;

  const { data: game, isLoading, isError } = useGame(gameId);

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

  return <GameDetail game={game} />;
}
