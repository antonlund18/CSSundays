import { useState, type FormEvent } from "react";
import {
  formatLabels,
  statusLabels,
  type TournamentDetails,
  type TournamentInput,
  type TournamentStatus,
} from "@/api/tournaments";
import { ImagePicker } from "@/components/ImagePicker";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

const sizes = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

/** yyyy-MM-ddTHH:mm in local time, for <input type="datetime-local">. */
function toLocalInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function defaultStart(): Date {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7 || 7)); // next Sunday
  date.setHours(12, 0, 0, 0);
  return date;
}

export type TournamentFormValues = TournamentInput & { picture: File | null };

export function TournamentForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
}: {
  initial?: TournamentDetails;
  submitLabel: string;
  busy: boolean;
  onSubmit: (values: TournamentFormValues) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [maxTeams, setMaxTeams] = useState(initial?.maxTeams ?? 16);
  const [startsAt, setStartsAt] = useState(toLocalInput(initial ? new Date(initial.startsAt) : defaultStart()));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [rules, setRules] = useState(initial?.rules ?? "");
  const [status, setStatus] = useState<TournamentStatus>(initial?.status ?? "OPEN_FOR_REGISTRATIONS");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [picture, setPicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError("Turneringsnavnet skal være mindst 2 tegn");
    const start = new Date(startsAt);
    if (Number.isNaN(start.getTime())) return setError("Ugyldigt starttidspunkt");
    if (initial && maxTeams < initial.registrations.length) return setError("Der er flere tilmeldte hold end pladser");
    setError(null);
    onSubmit({
      name: name.trim(),
      maxTeams: maxTeams,
      startsAt: start.toISOString(),
      description,
      rules,
      published,
      ...(initial ? { status } : {}),
      picture,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-4">
          <Field label="Turneringsnavn" htmlFor="t-name" error={error}>
            <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="CSSundays #3" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Størrelse (antal hold)" htmlFor="t-size">
              <Select id="t-size" value={maxTeams} onChange={(e) => setMaxTeams(Number(e.target.value))}>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Starttidspunkt" htmlFor="t-start">
              <Input id="t-start" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
            </Field>
            <Field label="Format" htmlFor="t-format">
              <Select id="t-format" disabled value="SINGLE_ELIMINATION">
                <option value="SINGLE_ELIMINATION">{formatLabels.SINGLE_ELIMINATION}</option>
              </Select>
            </Field>
            {initial && (
              <Field label="Status" htmlFor="t-status" hint="Ændres normalt automatisk af bracket og kampe.">
                <Select id="t-status" value={status} onChange={(e) => setStatus(e.target.value as TournamentStatus)}>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-primary" />
            Publicér (synlig for alle)
          </label>
        </div>
        <div>
          <p className="heading mb-1.5 text-xs text-muted">Billede</p>
          <ImagePicker src={initial?.pictureUrl} fallback="tournament" file={picture} onFileChange={setPicture} label="Upload billede" />
        </div>
      </div>

      {(
        [
          ["Beskrivelse", description, setDescription],
          ["Regler", rules, setRules],
        ] as const
      ).map(([label, value, setValue]) => (
        <div key={label} className="grid gap-4 md:grid-cols-2">
          <Field label={`${label} (markdown)`} htmlFor={`t-${label}`}>
            <Textarea id={`t-${label}`} value={value} onChange={(e) => setValue(e.target.value)} rows={14} className="font-mono text-xs" />
          </Field>
          <div>
            <p className="heading mb-1.5 text-xs text-muted">Preview</p>
            <div className="h-[calc(100%-1.6rem)] min-h-40 overflow-auto rounded-md border border-border bg-background/40 p-4">
              {value ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Intet indhold</p>}
            </div>
          </div>
        </div>
      ))}

      <Button type="submit" size="lg" disabled={busy}>
        {submitLabel}
      </Button>
    </form>
  );
}
