import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, ImagePlus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BASE_URL } from '@/shared/api/client';
import { useGenres } from '@/features/genres';
import type { GameDetailsDto } from '../types';
import { useUploadGameImage } from '../api/gamesApi';
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

  // Fall back to the placeholder if the image URL fails to load.
  // Storing the url alongside the flag means the error is automatically
  // treated as stale when imageUrl changes — no useEffect reset needed.
  const [imgState, setImgState] = useState({ url: game.imageUrl, failed: false });
  const imgFailed = imgState.url === game.imageUrl && imgState.failed;

  const { mutate: uploadImage, isPending: isUploading } = useUploadGameImage(game.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    // Reset so selecting the same file again fires onChange.
    e.target.value = '';
  }

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
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
              'focus-visible:border-primary/40 focus-visible:ring-primary/20',
            )}
          >
            Edit
          </Link>

          {/* Hidden file input — triggered by the button below */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
              'focus-visible:border-primary/40 focus-visible:ring-primary/20',
            )}
          >
            <ImagePlus className="size-4" />
            {isUploading ? 'Uploading…' : game.imageUrl ? 'Replace picture' : '+ Add picture'}
          </button>

          <DeleteGameButton
            gameId={game.id}
            gameName={game.name}
            onSuccess={() => navigate('/games')}
          />
        </div>
      </div>

      {/* Detail card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {/* Game avatar — centred above the title */}
        <div className="flex justify-center mb-6">
          {game.imageUrl && !imgFailed ? (
            <img
              src={`${BASE_URL}${game.imageUrl}`}
              alt={game.name}
              className="w-32 h-32 rounded-full object-cover border border-border"
              onError={() => setImgState({ url: game.imageUrl, failed: true })}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <Gamepad2 className="size-12 text-muted-foreground" />
            </div>
          )}
        </div>
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
