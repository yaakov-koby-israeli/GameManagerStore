import { Link } from 'react-router-dom';
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
}

export function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No games yet.{' '}
        <Link to="/games/new" className="underline underline-offset-4 hover:text-foreground">
          Add the first one.
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Name</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Release Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell className="pl-4">
              <Link
                to={`/games/${game.id}`}
                className="font-medium hover:underline"
              >
                {game.name}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{game.genre}</TableCell>
            <TableCell>{formatPrice(game.price)}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(game.releaseDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
