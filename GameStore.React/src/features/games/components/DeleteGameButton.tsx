import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteGame } from '../api/gamesApi';

interface DeleteGameButtonProps {
  gameId: number;
  gameName: string;
  /** Called after the game is successfully deleted. Use to navigate away. */
  onSuccess?: () => void;
}

export function DeleteGameButton({ gameId, gameName, onSuccess }: DeleteGameButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteGame, isPending } = useDeleteGame();

  function handleDelete() {
    deleteGame(gameId, {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.();
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      {/* Styled as a destructive button via buttonVariants — no nested <button> */}
      <AlertDialogTrigger className={buttonVariants({ variant: 'destructive' })}>
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{gameName}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The game will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
