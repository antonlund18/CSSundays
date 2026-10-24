import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";
import { PrismaClient } from "./generated/prisma/client.js";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

export type Db = typeof prisma;
/** A client or an interactive transaction; services accept either. */
export type Tx = Omit<Db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;
