import { TournamentFormat, TournamentStatus, type Prisma } from "../../generated/prisma/client.js";
import { imageUrl } from "../../lib/storage.js";
import { isStaff } from "../auth/auth.service.js";
import { builder, type Context } from "../builder.js";

builder.enumType(TournamentFormat, { name: "TournamentFormat" });
export const TournamentStatusEnum = builder.enumType(TournamentStatus, { name: "TournamentStatus" });

/** Unpublished tournaments (and their matches) are only visible to staff. */
export const visibleTournaments = (context: Context): Prisma.TournamentWhereInput =>
  isStaff(context.user) ? {} : { published: true };

export const TournamentRef = builder.prismaObject("Tournament", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    pictureUrl: t.string({ nullable: true, select: { picturePath: true }, resolve: (tournament) => imageUrl(tournament.picturePath) }),
    description: t.exposeString("description"),
    rules: t.exposeString("rules"),
    format: t.expose("format", { type: TournamentFormat }),
    startsAt: t.expose("startsAt", { type: "DateTime" }),
    maxTeams: t.exposeInt("maxTeams"),
    status: t.expose("status", { type: TournamentStatus }),
    published: t.exposeBoolean("published"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    registrationCount: t.relationCount("registrations"),
    registrations: t.relation("registrations", { query: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] } }),
    /** The bracket, ordered by heap position (1 = final). Empty until it is generated. */
    matches: t.relation("matches", { query: { orderBy: { position: "asc" } } }),
  }),
});

export const TournamentInput = builder.inputType("TournamentInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    rules: t.string({ required: true }),
    startsAt: t.field({ type: "DateTime", required: true }),
    maxTeams: t.int({ required: true }),
    published: t.boolean({ required: true }),
    status: t.field({ type: TournamentStatusEnum }),
  }),
});
