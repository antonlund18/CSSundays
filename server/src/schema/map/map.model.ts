import { builder } from "../builder.js";

export const GameMapRef = builder.prismaObject("GameMap", {
  fields: (t) => ({
    slug: t.exposeID("slug"),
    name: t.exposeString("name"),
    imageUrl: t.exposeString("imageUrl", { nullable: true }),
    /** The map name the game server loads, e.g. de_dust2. */
    serverMap: t.exposeString("serverMap", { nullable: true }),
    active: t.exposeBoolean("active"),
    sortOrder: t.exposeInt("sortOrder"),
  }),
});
