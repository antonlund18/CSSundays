// Local development data. Every account uses the password "password123";
// anton@cssundays.test is admin. Run with `npm run db:seed` (or `npx prisma db seed`).
import { prisma } from "../src/db.js";
import { hashPassword } from "../src/schema/auth/auth.service.js";

const PLAYERS = [
  "Anton", "asdasd", "s1mple", "dev1ce", "ZywOo", "NiKo", "m0NESY", "ropz",
  "blameF", "karrigan", "electroNic", "Twistzz", "broky", "frozen", "jks",
];

const TEAMS: [name: string, members: string[]][] = [
  ["Vinderholdet", ["Anton", "asdasd", "s1mple", "dev1ce", "ZywOo"]],
  ["Taberholdet", ["asdasd", "Anton", "NiKo"]],
  ["Testholdet", ["s1mple", "m0NESY", "ropz"]],
  ["Astralis Akademi", ["blameF", "karrigan", "jks"]],
  ["Natus Vincere", ["electroNic", "Twistzz", "broky", "frozen"]],
];

// Team and roster (first player is captain) registered for the first cup.
const REGISTRATIONS: [team: string, roster: string[]][] = [
  ["Vinderholdet", ["Anton", "dev1ce", "ZywOo"]],
  ["Taberholdet", ["asdasd", "NiKo"]],
  ["Testholdet", ["s1mple", "m0NESY"]],
  ["Astralis Akademi", ["blameF", "karrigan", "jks"]],
  ["Natus Vincere", ["electroNic", "Twistzz"]],
];

const daysFromNow = (days: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

async function main() {
  if (await prisma.user.count()) {
    console.info("Database already has users – skipping seed. Run `npm run db:reset` for a clean start.");
    return;
  }

  const passwordHash = await hashPassword("password123");
  const users = new Map<string, string>();
  for (const playertag of PLAYERS) {
    const user = await prisma.user.create({
      data: {
        email: `${playertag.toLowerCase()}@cssundays.test`,
        emailVerifiedAt: new Date(),
        passwordHash,
        playertag,
        playertagKey: playertag.toLowerCase(),
        role: playertag === "Anton" ? "ADMIN" : "USER",
        description: playertag === "Anton" ? "Arrangør af CSSundays." : "",
      },
    });
    users.set(playertag, user.id);
  }
  const id = (playertag: string) => users.get(playertag)!;

  const teams = new Map<string, number>();
  for (const [name, members] of TEAMS) {
    const team = await prisma.team.create({
      data: {
        name,
        nameKey: name.toLowerCase(),
        ownerId: id(members[0]),
        members: { create: members.map((member) => ({ userId: id(member) })) },
      },
    });
    teams.set(name, team.id);
  }

  const cup = await prisma.tournament.create({
    data: {
      name: "1.500 DKK - CSSundays #1",
      description:
        "## Velkommen til CSSundays #1\n\nSøndagens fedeste Counter-Strike turnering.\n\n- Præmiepulje: **1.500 DKK**\n- Format: Single elimination, BO1\n- Check-in: 30 minutter før start",
      rules:
        "1. Alle kampe spilles som BO1.\n2. Holdkaptajnen bekræfter, når holdet er klar.\n3. Kort vælges ved skiftevis at banne, indtil ét kort er tilbage.\n4. Snyd medfører diskvalifikation.",
      startsAt: daysFromNow(7, 12),
      maxTeams: 16,
      published: true,
      createdById: id("Anton"),
    },
  });

  for (const [index, [team, roster]] of REGISTRATIONS.entries()) {
    await prisma.tournamentRegistration.create({
      data: {
        tournamentId: cup.id,
        teamId: teams.get(team)!,
        captainId: id(roster[0]),
        createdAt: new Date(Date.now() - (REGISTRATIONS.length - index) * 60_000),
        players: { create: roster.map((player) => ({ tournamentId: cup.id, userId: id(player) })) },
      },
    });
  }

  await prisma.tournament.create({
    data: {
      name: "CSSundays #2",
      description: "Tilmeldingen er åben!",
      startsAt: daysFromNow(14, 12),
      maxTeams: 32,
      published: true,
      createdById: id("Anton"),
    },
  });

  console.info(`Seeded ${PLAYERS.length} players, ${TEAMS.length} teams and 2 tournaments.`);
}

await main();
await prisma.$disconnect();
