import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { addMap, mapsQuery, updateMap, type GameMap } from "@/api/matches";
import { Page, PageTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PageSpinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/maps")({
  component: AdminMapsPage,
});

/** The map name the game server loads; saved when the field loses focus. */
function ServerMapInput({ map, onSaved }: { map: GameMap; onSaved: () => void }) {
  const [value, setValue] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: (serverMap: string) => updateMap(map.slug, { serverMap }),
    onSuccess: () => {
      toast.success(`Server-kort for ${map.name} er gemt`);
      setValue(null);
      onSaved();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const current = value ?? map.serverMap ?? "";
  const commit = () => {
    if (value !== null && value.trim() !== (map.serverMap ?? "")) save.mutate(value.trim());
    else setValue(null);
  };

  return (
    <Input
      value={current}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
      disabled={save.isPending}
      placeholder={`de_${map.slug}`}
      aria-label={`Server-kort for ${map.name}`}
      className="h-8 font-mono text-xs"
    />
  );
}

function AdminMapsPage() {
  const queryClient = useQueryClient();
  const { data: maps, isPending } = useQuery(mapsQuery());
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [serverMap, setServerMap] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["maps"] });
  const toggle = useMutation({
    mutationFn: (map: GameMap) => updateMap(map.slug, { active: !map.active }),
    onSuccess: refresh,
    onError: (error) => toast.error(errorMessage(error)),
  });
  const add = useMutation({
    mutationFn: () => addMap(name.trim(), imageUrl.trim(), serverMap.trim()),
    onSuccess: () => {
      toast.success("Kortet er tilføjet");
      setName("");
      setImageUrl("");
      setServerMap("");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const active = maps?.filter((map) => map.active).length ?? 0;

  return (
    <Page>
      <PageTitle subtitle={`Aktive kort bruges i map veto. ${active} aktive – det sidste kort, der ikke bannes, bliver spillet.`}>Kortpulje</PageTitle>
      {isPending ? (
        <PageSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {maps?.map((map) => (
              <div key={map.slug} className="flex flex-col gap-1.5">
                <button
                  onClick={() => toggle.mutate(map)}
                  disabled={toggle.isPending}
                  className={cn(
                    "relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 bg-surface-3 bg-cover bg-center transition",
                    map.active ? "border-primary" : "border-transparent opacity-50 grayscale",
                  )}
                  style={map.imageUrl ? { backgroundImage: `url(${map.imageUrl})` } : undefined}
                >
                  <span className="heading absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-sm">{map.name}</span>
                  <span className={cn("heading absolute top-2 right-2 rounded px-2 py-0.5 text-[10px]", map.active ? "bg-primary" : "bg-surface-3")}>
                    {map.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </button>
                <ServerMapInput map={map} onSaved={refresh} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Feltet under hvert kort er det kortnavn, game-serveren indlæser (fx <span className="font-mono">de_dust2</span>). Tomt betyder{" "}
            <span className="font-mono">de_&lt;slug&gt;</span>.
          </p>
        </>
      )}
      <form
        className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          add.mutate();
        }}
      >
        <Field label="Nyt kort" htmlFor="map-name">
          <Input id="map-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dust II" required />
        </Field>
        <Field label="Server-kort" htmlFor="map-server">
          <Input id="map-server" value={serverMap} onChange={(e) => setServerMap(e.target.value)} placeholder="de_dust2" className="font-mono" />
        </Field>
        <Field label="Billede-URL" htmlFor="map-image">
          <Input id="map-image" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </Field>
        <Button type="submit" disabled={add.isPending}>
          <Plus /> Tilføj
        </Button>
      </form>
    </Page>
  );
}
