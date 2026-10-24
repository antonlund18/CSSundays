import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, FastForward, Play, RotateCcw, Shuffle, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mapsQuery, phaseLabels, type MatchDetails } from "@/api/matches";
import { StoredImage } from "@/components/avatars";
import { Page, PageTitle, Panel, SectionTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/misc";
import { MatchActionsContext, MatchPhase, type MatchActions } from "@/features/match/MatchPhases";
import { banTurn } from "@/lib/bracket";
import { ApiError } from "@/lib/graphql";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/match-test")({
  component: MatchTestPage,
});

// A local simulation of the match flow in server/src/schema/match/match.service.ts. It
// renders the real phase components but never touches the database, so staff
// can click through ready check, veto and result from either captain's seat.

const CAPTAIN_1 = "sandbox-captain-1";
const CAPTAIN_2 = "sandbox-captain-2";

const side = (id: number, name: string, captainId: string, players: string[]) => ({
  id,
  captainId,
  team: { id, name, avatarUrl: null },
  players: [
    { id: captainId, playertag: players[0], avatarUrl: null },
    ...players.slice(1).map((playertag, index) => ({ id: `${captainId}-${index}`, playertag, avatarUrl: null })),
  ],
});

function initialMatch(): MatchDetails {
  return {
    id: -1,
    tournamentId: -1,
    position: 1,
    phase: "WAITING_TO_START",
    phaseEndsAt: null,
    team1Ready: false,
    team2Ready: false,
    firstBanTeam: null,
    mapSlug: null,
    winner: null,
    serverAddress: null,
    tournament: { id: -1, name: "Testturnering", status: "IN_PROGRESS" },
    registration1: side(1, "Testhold A", CAPTAIN_1, ["Kaptajn A", "Spiller A2", "Spiller A3"]),
    registration2: side(2, "Testhold B", CAPTAIN_2, ["Kaptajn B", "Spiller B2", "Spiller B3"]),
    bans: [],
  };
}

const VIEWERS = [
  { key: "captain1", label: "Kaptajn A", userId: CAPTAIN_1, isStaff: false },
  { key: "captain2", label: "Kaptajn B", userId: CAPTAIN_2, isStaff: false },
  { key: "spectator", label: "Tilskuer", userId: null, isStaff: false },
  { key: "staff", label: "Arrangør", userId: null, isStaff: true },
] as const;

type ViewerKey = (typeof VIEWERS)[number]["key"];

const secondsFromNow = (seconds: number) => new Date(Date.now() + seconds * 1000).toISOString();
const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

// --- Transitions (mirroring the server) -------------------------------------------

type Settings = { pool: string[]; readySeconds: number; banSeconds: number };
/** A state transition plus the line it adds to the log. */
type Step = (match: MatchDetails, settings: Settings) => [MatchDetails, string];

const remainingMaps = (match: MatchDetails, pool: string[]) => pool.filter((slug) => !match.bans.some((ban) => ban.mapSlug === slug));
const currentTurn = (match: MatchDetails) => banTurn(match.firstBanTeam ?? 1, match.bans.length);
const captainSide = (userId: string | null) => (userId === CAPTAIN_1 ? 1 : userId === CAPTAIN_2 ? 2 : null);

function startReadyCheck(match: MatchDetails, { readySeconds }: Settings): MatchDetails {
  return {
    ...match,
    phase: "READY_CHECK",
    phaseEndsAt: secondsFromNow(readySeconds),
    team1Ready: false,
    team2Ready: false,
    firstBanTeam: null,
    mapSlug: null,
    winner: null,
    bans: [],
  };
}

function startPickAndBan(match: MatchDetails, { pool, banSeconds }: Settings): MatchDetails {
  if (pool.length <= 1) return { ...match, phase: "IN_PROGRESS", phaseEndsAt: null, mapSlug: pool[0] ?? null, bans: [] };
  return { ...match, phase: "PICK_AND_BAN", phaseEndsAt: secondsFromNow(banSeconds), firstBanTeam: Math.random() < 0.5 ? 1 : 2, bans: [] };
}

/** Bans for the team whose turn it is; the last remaining map is played. */
function applyBan(match: MatchDetails, mapSlug: string, automatic: boolean, settings: Settings): MatchDetails {
  const ordinal = match.bans.length + 1;
  const bans = [...match.bans, { id: ordinal, ordinal, mapSlug, team: currentTurn(match), automatic }];
  const remaining = remainingMaps({ ...match, bans }, settings.pool);
  if (remaining.length <= 1) return { ...match, bans, phase: "IN_PROGRESS", phaseEndsAt: null, mapSlug: remaining[0] ?? null };
  return { ...match, bans, phaseEndsAt: secondsFromNow(settings.banSeconds) };
}

const markTeamReady =
  (team: 1 | 2): Step =>
  (match, settings) => {
    const next = { ...match, team1Ready: match.team1Ready || team === 1, team2Ready: match.team2Ready || team === 2 };
    if (next.team1Ready && next.team2Ready) return [startPickAndBan(next, settings), `Hold ${team} er klar – begge hold klar, map veto starter`];
    return [next, `Hold ${team} er klar`];
  };

/** Bans `map`, or a random remaining map when null. */
const banStep =
  (map: string | null, suffix = ""): Step =>
  (match, settings) => {
    const team = currentTurn(match);
    const slug = map ?? randomItem(remainingMaps(match, settings.pool));
    return [applyBan(match, slug, false, settings), `Hold ${team} bannede ${slug}${suffix}`];
  };

const timeoutStep: Step = (match, settings) => {
  if (match.phase === "READY_CHECK") return [startPickAndBan(match, settings), "Klar-tjek udløb – går videre til map veto"];
  if (match.phase === "PICK_AND_BAN") {
    const team = currentTurn(match);
    const map = randomItem(remainingMaps(match, settings.pool));
    return [applyBan(match, map, true, settings), `Hold ${team} løb tør for tid – ${map} blev auto-bannet`];
  }
  return [match, "Ingen timer at udløbe"];
};

function MatchTestPage() {
  const { data: maps = [] } = useQuery(mapsQuery());
  const pool = useMemo(() => maps.filter((map) => map.active).map((map) => map.slug), [maps]);

  const [{ match, log }, setState] = useState(() => ({ match: initialMatch(), log: [] as string[] }));
  const [viewer, setViewer] = useState<ViewerKey>("captain1");
  const [readySeconds, setReadySeconds] = useState(60);
  const [banSeconds, setBanSeconds] = useState(30);
  const settings = useMemo(() => ({ pool, readySeconds, banSeconds }), [pool, readySeconds, banSeconds]);

  const run = useCallback(
    (step: Step) =>
      setState((state) => {
        const [next, line] = step(state.match, settings);
        return { match: next, log: [`${new Date().toLocaleTimeString("da-DK")}  ${line}`, ...state.log].slice(0, 50) };
      }),
    [settings],
  );

  // One timer per deadline, like armTimer() on the server.
  useEffect(() => {
    if (!match.phaseEndsAt) return;
    const deadline = new Date(match.phaseEndsAt).getTime();
    const timer = setTimeout(() => run((current, config) => (current.phaseEndsAt === match.phaseEndsAt ? timeoutStep(current, config) : [current, "Timer ignoreret"])), Math.max(0, deadline - Date.now()) + 50);
    return () => clearTimeout(timer);
  }, [match.phaseEndsAt, run]);

  // --- Captain actions (with the server's checks) ----------------------------------

  const active = VIEWERS.find((entry) => entry.key === viewer)!;
  const actions: MatchActions = {
    userId: active.userId,
    isStaff: active.isStaff,
    markReady: async () => {
      if (match.phase !== "READY_CHECK") throw new ApiError("WRONG_PHASE");
      const team = captainSide(active.userId);
      if (!team) throw new ApiError("NOT_CAPTAIN");
      run(markTeamReady(team));
    },
    banMap: async (_matchId, map) => {
      if (match.phase !== "PICK_AND_BAN") throw new ApiError("WRONG_PHASE");
      if (captainSide(active.userId) !== currentTurn(match)) throw new ApiError("NOT_YOUR_TURN");
      if (!pool.includes(map)) throw new ApiError("INVALID_MAP");
      if (match.bans.some((ban) => ban.mapSlug === map)) throw new ApiError("MAP_ALREADY_BANNED");
      run(banStep(map));
    },
  };

  // --- Staff shortcuts ------------------------------------------------------------------

  const turnTeam = match.phase === "PICK_AND_BAN" ? currentTurn(match) : null;

  const controls: { label: string; icon: React.ReactNode; enabled: boolean; step: Step }[] = [
    {
      label: "Start klar-tjek",
      icon: <Play />,
      enabled: match.phase !== "READY_CHECK",
      step: (current, config) => [startReadyCheck(current, config), "Klar-tjek startet"],
    },
    {
      label: "Begge hold klar",
      icon: <Check />,
      enabled: match.phase === "READY_CHECK",
      step: (current, config) => [startPickAndBan({ ...current, team1Ready: true, team2Ready: true }, config), "Begge hold markeret klar – map veto starter"],
    },
    {
      label: turnTeam ? `Tilfældigt ban (hold ${turnTeam})` : "Tilfældigt ban",
      icon: <Shuffle />,
      enabled: match.phase === "PICK_AND_BAN",
      step: banStep(null, " (simuleret)"),
    },
    {
      label: "Udløb timer nu",
      icon: <FastForward />,
      enabled: !!match.phaseEndsAt,
      step: timeoutStep,
    },
    ...([1, 2] as const).map((winner) => ({
      label: `${(winner === 1 ? match.registration1 : match.registration2)?.team.name} vandt`,
      icon: <Trophy />,
      enabled: match.phase !== "FINISHED",
      step: ((current) => [{ ...current, phase: "FINISHED", phaseEndsAt: null, winner }, `Hold ${winner} registreret som vinder`]) as Step,
    })),
    {
      label: "Nulstil",
      icon: <RotateCcw />,
      enabled: true,
      step: (current) => [{ ...initialMatch(), serverAddress: current.serverAddress }, "Kampen er nulstillet"],
    },
  ];

  return (
    <Page wide>
      <PageTitle subtitle="Simulerer en kamp lokalt i browseren med de rigtige kampkomponenter. Intet gemmes i databasen.">Test kampforløb</PageTitle>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1 rounded-lg border border-border p-1" role="group" aria-label="Se kampen som">
              {VIEWERS.map((entry) => (
                <button
                  key={entry.key}
                  onClick={() => setViewer(entry.key)}
                  aria-pressed={viewer === entry.key}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1.5 text-xs font-bold transition",
                    viewer === entry.key ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <Badge tone="primary">{phaseLabels[match.phase]}</Badge>
          </div>

          <div className="flex items-center justify-between gap-4">
            {[match.registration1, match.registration2].map((entry, index) => (
              <div key={index} className={cn("flex items-center gap-3", index === 1 && "flex-row-reverse")}>
                <StoredImage src={null} fallback="team" alt="" className="size-14" />
                <span className={cn("heading text-xl", index === 0 ? "text-primary" : "text-accent-light")}>{entry?.team.name}</span>
              </div>
            ))}
          </div>

          <div className="my-6 border-y border-border py-6">
            <MatchActionsContext.Provider value={actions}>
              <MatchPhase match={match} isParticipant={active.userId !== null} />
            </MatchActionsContext.Provider>
          </div>
          {pool.length === 0 && <p className="text-sm text-warning">Der er ingen aktive kort – aktivér nogle under Kort.</p>}
        </div>

        <div className="flex flex-col gap-4">
          <Panel className="p-4">
            <SectionTitle>Styring</SectionTitle>
            <div className="flex flex-col gap-2">
              {controls.map((control) => (
                <Button key={control.label} variant="outline" size="sm" className="justify-start" disabled={!control.enabled} onClick={() => run(control.step)}>
                  {control.icon} {control.label}
                </Button>
              ))}
            </div>
          </Panel>

          <Panel className="flex flex-col gap-3 p-4">
            <SectionTitle className="mb-0">Indstillinger</SectionTitle>
            <label className="flex items-center justify-between gap-2 text-sm">
              Klar-tjek (sek.)
              <Input type="number" min={1} value={readySeconds} onChange={(e) => setReadySeconds(Math.max(1, Number(e.target.value) || 1))} className="w-24" />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              Ban-tur (sek.)
              <Input type="number" min={1} value={banSeconds} onChange={(e) => setBanSeconds(Math.max(1, Number(e.target.value) || 1))} className="w-24" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Server-adresse
              <Input
                placeholder="127.0.0.1:27015"
                value={match.serverAddress ?? ""}
                onChange={(e) => {
                  const serverAddress = e.target.value || null;
                  setState((state) => ({ ...state, match: { ...state.match, serverAddress } }));
                }}
              />
            </label>
          </Panel>

          <Panel className="p-4">
            <SectionTitle>Log</SectionTitle>
            {log.length === 0 ? (
              <p className="text-xs text-muted">Ingen hændelser endnu.</p>
            ) : (
              <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto font-mono text-xs text-muted">
                {log.map((line, index) => (
                  <li key={log.length - index}>{line}</li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </Page>
  );
}
