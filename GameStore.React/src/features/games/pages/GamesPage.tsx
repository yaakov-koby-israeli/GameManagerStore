import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGames } from '../api/gamesApi';
import { GameList } from '../components/GameList';

function GameListSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 px-4 py-3.5">
          <div className="h-4 w-44 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function GamesPage() {
  const { data: games, isLoading, isError } = useGames();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Genre is already a resolved name string in GameSummaryDto — no extra API call needed
  const uniqueGenres = [...new Set(games?.map((g) => g.genre) ?? [])].sort();

  const filtered =
    games?.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === '' || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    }) ?? [];

  const hasFilters = searchQuery !== '' || selectedGenre !== '';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Games Catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your game library
          </p>
        </div>
        <Link to="/games/new" className={buttonVariants()}>
          Add Game
        </Link>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={selectedGenre || null}
            onValueChange={(v) => setSelectedGenre(v ?? '')}
          >
            <SelectTrigger className="min-w-[130px]">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Genres</SelectItem>
              {uniqueGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scrollable content area — constrains height so sticky thead works */}
        <div className="max-h-[calc(100vh-14rem)] overflow-y-auto">
          {isLoading && <GameListSkeleton />}
          {isError && (
            <div className="flex items-center justify-center py-16 text-sm text-destructive">
              Failed to load games. Is the backend running?
            </div>
          )}
          {games && <GameList games={filtered} hasActiveFilters={hasFilters} />}
        </div>
      </div>
    </div>
  );
}
