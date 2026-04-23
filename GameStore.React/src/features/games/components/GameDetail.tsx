import { Link, useNavigate } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { useGenres } from '@/features/genres';
import type { GameDetailsDto } from '../types';
import { DeleteGameButton } from './DeleteGameButton';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface GameDetailProps {
  game: GameDetailsDto;
}

export function GameDetail({ game }: GameDetailProps) {
  const navigate = useNavigate();
  const { data: genres } = useGenres();
  const genreName = genres?.find((g) => g.id === game.genre)?.name ?? '…';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/games"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Games
        </Link>
        <div className="flex gap-2">
          <Link
            to={`/games/${game.id}/edit`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Edit
          </Link>
          <DeleteGameButton
            gameId={game.id}
            gameName={game.name}
            onSuccess={() => navigate('/games')}
          />
        </div>
      </div>

      {/* Detail card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">{game.name}</h1>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-3 text-sm">
          <dt className="text-muted-foreground self-center">Genre</dt>
          <dd>{genreName}</dd>
          <dt className="text-muted-foreground self-center">Price</dt>
          <dd>{formatPrice(game.price)}</dd>
          <dt className="text-muted-foreground self-center">Release Date</dt>
          <dd>{formatDate(game.releaseDate)}</dd>
        </dl>
      </div>
    </div>
  );
}
