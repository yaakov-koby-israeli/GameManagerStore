import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGenres } from '@/features/genres';

// ---------------------------------------------------------------------------
// Schema — mirrors API validation rules exactly.
// Use z.number() (not z.coerce) so the inferred input type stays as `number`,
// which keeps useForm<GameFormValues> type-safe with the zodResolver.
// Coercion from HTML strings is handled by register()'s valueAsNumber /
// setValueAs options below.
// ---------------------------------------------------------------------------
const gameSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or fewer'),
  genreId: z
    .number({ error: 'Please select a genre' })
    .min(1, 'Please select a genre'),
  price: z
    .number({ error: 'Price is required' })
    .min(1, 'Price must be at least $1.00')
    .max(100, 'Price cannot exceed $100.00'),
  releaseDate: z.string().min(1, 'Release date is required'),
});

export type GameFormValues = z.infer<typeof gameSchema>;

// ---------------------------------------------------------------------------
// Small layout helper — keeps field markup DRY
// ---------------------------------------------------------------------------
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Select styled to match shadcn Input appearance
const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors ' +
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ' +
  'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20';

// ---------------------------------------------------------------------------
// GameForm — shared by CreateGamePage (blank) and EditGamePage (pre-filled)
// ---------------------------------------------------------------------------
interface GameFormProps {
  defaultValues?: Partial<GameFormValues>;
  onSubmit: (data: GameFormValues) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function GameForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Save Game',
}: GameFormProps) {
  const { data: genres = [] } = useGenres();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="e.g. Street Fighter II"
          aria-invalid={errors.name ? true : undefined}
          {...register('name')}
        />
      </Field>

      <Field label="Genre" htmlFor="genreId" error={errors.genreId?.message}>
        {/* setValueAs converts the select's string value → number for Zod */}
        <select
          id="genreId"
          aria-invalid={errors.genreId ? true : undefined}
          className={selectClass}
          {...register('genreId', {
            setValueAs: (v: string) => (v === '' ? NaN : parseInt(v, 10)),
          })}
        >
          <option value="">Select a genre…</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Price (USD)" htmlFor="price" error={errors.price?.message}>
        {/* valueAsNumber converts the string from the number input → number for Zod */}
        <Input
          id="price"
          type="number"
          step="0.01"
          min="1"
          max="100"
          placeholder="e.g. 19.99"
          aria-invalid={errors.price ? true : undefined}
          {...register('price', { valueAsNumber: true })}
        />
      </Field>

      <Field label="Release Date" htmlFor="releaseDate" error={errors.releaseDate?.message}>
        <Input
          id="releaseDate"
          type="date"
          aria-invalid={errors.releaseDate ? true : undefined}
          {...register('releaseDate')}
        />
      </Field>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
