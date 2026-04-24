import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { GameSummaryDto } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

// Parse DateOnly string ("2025-01-15") without timezone shift
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface GameListProps {
  games: GameSummaryDto[];
  hasActiveFilters: boolean;
}

export function GameList({ games, hasActiveFilters }: GameListProps) {
  const navigate = useNavigate();

  if (games.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        {hasActiveFilters ? (
          'No games match your filters.'
        ) : (
          <>
            No games yet.{' '}
            <Link to="/games/new" className="underline underline-offset-4 hover:text-foreground">
              Add the first one.
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-surface-subtle">
        <TableRow className="border-b hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Genre
          </TableHead>
          <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Price
          </TableHead>
          <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Release Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow
            key={game.id}
            onClick={() => navigate(`/games/${game.id}`)}
            className="cursor-pointer hover:bg-accent"
          >
            <TableCell className="py-3.5 pl-4">
              <span className="font-medium text-foreground">{game.name}</span>
            </TableCell>
            <TableCell className="py-3.5 text-muted-foreground">{game.genre}</TableCell>
            <TableCell className="py-3.5 tabular-nums">{formatPrice(game.price)}</TableCell>
            <TableCell className="py-3.5 text-muted-foreground">
              {formatDate(game.releaseDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
