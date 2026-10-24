import { describe, expect, it } from "vitest";
import { activityStatus, opponentOf, type ActiveMatch, type ActiveRegistration } from "./activity";

const CAPTAIN = "captain";
const PLAYER = "player";

const side = (id: number, name: string) => ({ id, team: { id, name, avatarUrl: null } });

function registration(match: Partial<ActiveMatch> | null, status: ActiveRegistration["tournament"]["status"] = "IN_PROGRESS"): ActiveRegistration {
  return {
    id: 10,
    captainId: CAPTAIN,
    tournament: { id: 1, name: "Cup", pictureUrl: null, status, startsAt: "2026-11-01T18:00:00Z" },
    currentMatch: match && {
      id: 5,
      phase: "WAITING_FOR_TEAMS",
      phaseEndsAt: null,
      team1Ready: false,
      team2Ready: false,
      firstBanTeam: null,
      serverAddress: null,
      registration1Id: 10,
      registration2Id: 20,
      registration1: side(10, "Us"),
      registration2: side(20, "Them"),
      bans: [],
      ...match,
    },
  };
}

describe("activityStatus", () => {
  it("asks only our captain to ready up, until we are ready", () => {
    const pending = registration({ phase: "READY_CHECK", phaseEndsAt: "2026-11-01T18:01:00Z" });
    expect(activityStatus(pending, CAPTAIN)).toMatchObject({ action: true, endsAt: "2026-11-01T18:01:00Z" });
    expect(activityStatus(pending, PLAYER).action).toBe(false);
    expect(activityStatus(registration({ phase: "READY_CHECK", team1Ready: true }), CAPTAIN).action).toBe(false);
  });

  it("uses our side when we are team 2", () => {
    const match = { phase: "READY_CHECK" as const, registration1Id: 20, registration2Id: 10, team1Ready: false, team2Ready: true };
    expect(activityStatus(registration(match), CAPTAIN).action).toBe(false);
  });

  it("asks our captain to ban only on our turn", () => {
    // Team 1 bans first, so with one ban made it is team 2's turn.
    expect(activityStatus(registration({ phase: "PICK_AND_BAN", firstBanTeam: 1 }), CAPTAIN).action).toBe(true);
    expect(activityStatus(registration({ phase: "PICK_AND_BAN", firstBanTeam: 1, bans: [{ id: 1 }] }), CAPTAIN).action).toBe(false);
  });

  it("asks every player to join once the server is ready", () => {
    expect(activityStatus(registration({ phase: "IN_PROGRESS" }), PLAYER).action).toBe(false);
    expect(activityStatus(registration({ phase: "IN_PROGRESS", serverAddress: "1.2.3.4:27015" }), PLAYER)).toMatchObject({
      action: true,
      connect: "1.2.3.4:27015",
    });
  });

  it("describes tournaments without a current match", () => {
    expect(activityStatus(registration(null, "OPEN_FOR_REGISTRATIONS"), PLAYER).text).toMatch(/^Tilmeldt/);
    expect(activityStatus(registration(null, "IN_PROGRESS"), PLAYER).text).toBe("Ude af turneringen");
  });
});

describe("opponentOf", () => {
  it("returns the other side", () => {
    expect(opponentOf(registration({}))?.team.name).toBe("Them");
    expect(opponentOf(registration({ registration1Id: 20, registration2Id: 10, registration1: side(20, "Them"), registration2: side(10, "Us") }))?.team.name).toBe("Them");
    expect(opponentOf(registration(null))).toBeNull();
  });
});
