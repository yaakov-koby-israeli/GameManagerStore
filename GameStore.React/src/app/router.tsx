import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GamesPage } from '@/features/games/pages/GamesPage';
import { GameDetailPage } from '@/features/games/pages/GameDetailPage';
import { CreateGamePage } from '@/features/games/pages/CreateGamePage';
import { EditGamePage } from '@/features/games/pages/EditGamePage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/games" replace /> },
  { path: '/games', element: <GamesPage /> },
  { path: '/games/new', element: <CreateGamePage /> },
  { path: '/games/:id', element: <GameDetailPage /> },
  { path: '/games/:id/edit', element: <EditGamePage /> },
]);
