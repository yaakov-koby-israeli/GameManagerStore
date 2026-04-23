import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { useGames } from '../api/gamesApi';
import { GameList } from '../components/GameList';

export function GamesPage() {
  const { data: games, isLoading, isError } = useGames();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Games</h1>
        <Link to="/games/new" className={buttonVariants()}>
          Add Game
        </Link>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            Loading games…
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center py-16 text-sm text-destructive">
            Failed to load games. Is the backend running?
          </div>
        )}
        {games && <GameList games={games} />}
      </div>
    </div>
  );
}
