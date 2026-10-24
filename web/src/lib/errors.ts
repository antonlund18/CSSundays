/** Danish messages for the error codes raised by the database functions and Supabase Auth. */
const messages: Record<string, string> = {
  NOT_AUTHENTICATED: "Du skal være logget ind.",
  FORBIDDEN: "Du har ikke adgang til at gøre dette.",
  NOT_FOUND: "Kunne ikke findes.",
  INVALID_PLAYERTAG: "Ugyldigt brugernavn.",
  CANNOT_DEMOTE_SELF: "Du kan ikke fjerne din egen admin-rolle.",
  INVALID_TEAM_NAME: "Dit holdnavn skal være mellem 2 og 32 tegn.",
  TEAM_NAME_IN_USE: "Holdnavnet er allerede i brug.",
  OWNER_CANNOT_LEAVE: "Ejeren kan ikke forlade holdet.",
  NOT_TEAM_MEMBER: "Du er ikke medlem af holdet.",
  ALREADY_TEAM_MEMBER: "Spilleren er allerede på holdet.",
  INVITE_ALREADY_PENDING: "Spilleren har allerede en invitation til holdet.",
  INVITE_NOT_PENDING: "Invitationen er allerede besvaret.",
  REGISTRATION_CLOSED: "Tilmeldingen er lukket.",
  ALREADY_REGISTERED: "Du er allerede tilmeldt turneringen.",
  TOURNAMENT_FULL: "Turneringen er fuld.",
  TEAM_FULL: "Holdet har allerede 5 tilmeldte spillere.",
  NOT_REGISTERED: "Du er ikke tilmeldt turneringen.",
  BRACKET_LOCKED: "Bracket er oprettet – kontakt en arrangør for at afmelde.",
  WRONG_PHASE: "Kampen er ikke i den rigtige fase.",
  NOT_CAPTAIN: "Kun holdkaptajnen kan gøre dette.",
  NOT_YOUR_TURN: "Det er ikke din tur til at banne.",
  INVALID_MAP: "Ugyldigt kort.",
  MAP_ALREADY_BANNED: "Kortet er allerede bannet.",
  TOURNAMENT_ALREADY_STARTED: "Turneringen er allerede startet.",
  NOT_ENOUGH_TEAMS: "Der skal mindst være 2 tilmeldte hold.",
  NO_BRACKET: "Opret en bracket først.",
  INVALID_WINNER: "Ugyldig vinder.",
  MATCH_NOT_READY: "Kampen mangler hold.",
  TOURNAMENT_NOT_STARTED: "Turneringen er ikke startet.",
  STEAM_VERIFICATION_FAILED: "Steam verifikation mislykkedes.",
  STEAM_ALREADY_LINKED: "Denne Steam-konto er allerede knyttet til en anden bruger.",
  SERVERS_NOT_CONFIGURED: "Automatiske servere er ikke sat op (DatHost).",
  NO_FREE_SERVER: "Alle servere er optaget lige nu.",
  TEST_SERVER_RUNNING: "Der kører allerede en test-server.",
  SERVER_START_FAILED: "Serveren kunne ikke startes. Se API-loggen for detaljer.",
  STEAM_REQUIRED: "Du skal forbinde din Steam-konto, før du kan tilmelde dig.",
  // Accounts
  INVALID_INPUT: "Ugyldige oplysninger.",
  INVALID_CREDENTIALS: "Forkert e-mail eller kodeord. Prøv igen.",
  EMAIL_NOT_CONFIRMED: "Bekræft din e-mail via linket i den mail, vi har sendt dig.",
  EMAIL_IN_USE: "E-mail i brug.",
  INVALID_EMAIL: "Ugyldig e-mail.",
  INVALID_PASSWORD: "Kodeordet skal være mellem 6 og 72 tegn.",
  PLAYERTAG_IN_USE: "Brugernavn i brug.",
  INVALID_TOKEN: "Linket er ugyldigt eller udløbet.",
  INVALID_IMAGE: "Billedet skal være PNG, JPG, WEBP eller GIF og højst 2 MB.",
  NETWORK_ERROR: "Kunne ikke få forbindelse til serveren. Prøv igen.",
};

type ErrorLike = { message?: unknown; code?: unknown };

export function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const { message, code } = error as ErrorLike;
  if (typeof message === "string" && message in messages) return message;
  if (typeof code === "string" && code in messages) return code;
  return undefined;
}

export function errorMessage(error: unknown, fallback = "Der skete en fejl. Prøv igen."): string {
  const code = errorCode(error);
  return code ? messages[code] : fallback;
}
