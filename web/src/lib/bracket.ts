/**
 * Brackets are stored as a complete binary tree with heap numbering: the final
 * is position 1 and the children of position p are 2p and 2p + 1.
 */

export type Positioned = { position: number };

/** Number of first-round slots (a power of two). */
export function bracketSize(matches: Positioned[]): number {
  const highest = matches.reduce((max, match) => Math.max(max, match.position), 0);
  return highest + 1;
}

export function roundCount(size: number): number {
  return Math.round(Math.log2(size));
}

/** Rounds from the first round to the final, each ordered top to bottom. */
export function groupByRound<T extends Positioned>(matches: T[]): T[][] {
  if (matches.length === 0) return [];
  const size = bracketSize(matches);
  const byPosition = new Map(matches.map((match) => [match.position, match]));
  const rounds: T[][] = [];
  for (let width = size / 2; width >= 1; width /= 2) {
    const round: T[] = [];
    for (let position = width; position < width * 2; position++) {
      const match = byPosition.get(position);
      if (match) round.push(match);
    }
    rounds.push(round);
  }
  return rounds;
}

/** Danish round label, counted from the final. */
export function roundName(roundIndex: number, totalRounds: number): string {
  const fromFinal = totalRounds - 1 - roundIndex;
  if (fromFinal === 0) return "Finale";
  if (fromFinal === 1) return "Semifinale";
  if (fromFinal === 2) return "Kvartfinale";
  return `Runde ${roundIndex + 1}`;
}

/** Which team bans next. Mirrors public._ban_turn(). */
export function banTurn(firstBanTeam: number, bansMade: number): 1 | 2 {
  return (firstBanTeam + bansMade) % 2 === 1 ? 1 : 2;
}
