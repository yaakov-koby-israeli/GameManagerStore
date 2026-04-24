import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    control,
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
        {/*
          Controller bridges RHF (numeric genreId) with the Base UI Select
          (string values). We stringify on the way in and parse on the way out.
          Number.isFinite guards against the initial NaN / undefined state so
          the placeholder shows correctly before the user picks a genre.
        */}
        <Controller
          control={control}
          name="genreId"
          render={({ field }) => (
            <Select
              value={Number.isFinite(field.value) ? String(field.value) : null}
              onValueChange={(v) => field.onChange(v != null ? parseInt(v, 10) : NaN)}
            >
              <SelectTrigger
                id="genreId"
                className="w-full"
                aria-invalid={errors.genreId ? true : undefined}
              >
                <SelectValue placeholder="Select a genre…" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={String(genre.id)}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
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
