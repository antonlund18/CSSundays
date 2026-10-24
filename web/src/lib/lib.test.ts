import { describe, expect, it } from "vitest";
import { banTurn, bracketSize, groupByRound, roundCount, roundName } from "./bracket";
import { errorMessage } from "./errors";
import { formatCountdown, formatRelative, winrate } from "./format";
import { isValidPassword, isValidPlayertag } from "./validation";

const positions = (count: number) => Array.from({ length: count }, (_, index) => ({ position: index + 1 }));

describe("bracket", () => {
  it("groups a 7-match bracket into rounds from first round to final", () => {
    const rounds = groupByRound(positions(7));
    expect(rounds.map((round) => round.map((match) => match.position))).toEqual([[4, 5, 6, 7], [2, 3], [1]]);
  });

  it("handles a single final", () => {
    expect(groupByRound(positions(1))).toEqual([[{ position: 1 }]]);
    expect(groupByRound([])).toEqual([]);
  });

  it("derives size and round count", () => {
    expect(bracketSize(positions(15))).toBe(16);
    expect(roundCount(16)).toBe(4);
  });

  it("names rounds from the final", () => {
    expect([0, 1, 2, 3, 4].map((round) => roundName(round, 5))).toEqual([
      "Runde 1",
      "Runde 2",
      "Kvartfinale",
      "Semifinale",
      "Finale",
    ]);
  });

  it("alternates ban turns like the database", () => {
    expect([0, 1, 2, 3].map((bans) => banTurn(1, bans))).toEqual([1, 2, 1, 2]);
    expect([0, 1, 2, 3].map((bans) => banTurn(2, bans))).toEqual([2, 1, 2, 1]);
  });
});

describe("format", () => {
  it("formats countdowns", () => {
    expect(formatCountdown(65.2)).toBe("01:06");
    expect(formatCountdown(0)).toBe("00:00");
    expect(formatCountdown(-3)).toBe("00:00");
  });

  it("formats relative times in Danish", () => {
    const now = new Date("2026-10-23T12:00:00Z");
    expect(formatRelative("2026-10-23T11:59:59Z", now)).toBe("1 sekund siden");
    expect(formatRelative("2026-10-23T09:00:00Z", now)).toBe("3 timer siden");
    expect(formatRelative("2026-10-20T12:00:00Z", now)).toBe("3 dage siden");
    expect(formatRelative("2026-10-23T12:00:00Z", now)).toBe("lige nu");
  });

  it("computes winrates", () => {
    expect(winrate(0, 0)).toBe("0%");
    expect(winrate(3, 0)).toBe("100%");
    expect(winrate(2, 1)).toBe("67%");
  });
});

describe("validation", () => {
  it("accepts the same playertags as the database", () => {
    expect(isValidPlayertag("s1mple")).toBe(true);
    expect(isValidPlayertag("Æbleskiver_99")).toBe(true);
    expect(isValidPlayertag("a")).toBe(false);
    expect(isValidPlayertag("has space")).toBe(false);
    expect(isValidPlayertag("waytoolongplayertag")).toBe(false);
  });

  it("checks password length", () => {
    expect(isValidPassword("12345")).toBe(false);
    expect(isValidPassword("123456")).toBe(true);
  });
});

describe("errors", () => {
  it("translates database error codes and falls back for unknown errors", () => {
    expect(errorMessage({ message: "TEAM_FULL" })).toBe("Holdet har allerede 5 tilmeldte spillere.");
    expect(errorMessage({ code: "INVALID_CREDENTIALS" })).toMatch(/Forkert/);
    expect(errorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});
