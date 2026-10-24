import { prisma } from "../../db.js";
import { fail } from "../../lib/errors.js";
import { builder, staff } from "../builder.js";

/** Server map names look like de_dust2 or cs_office; empty clears the value. */
function serverMapName(value: string | null | undefined) {
  const name = value?.trim().toLowerCase();
  if (!name) return null;
  if (!/^[a-z0-9_]{2,64}$/.test(name)) fail("INVALID_INPUT");
  return name;
}

builder.mutationFields((t) => ({
  addMap: t.prismaField({
    type: "GameMap",
    authScopes: staff,
    args: { name: t.arg.string({ required: true }), imageUrl: t.arg.string(), serverMap: t.arg.string() },
    resolve: async (query, _root, { name, imageUrl, serverMap }) => {
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      if (!slug) fail("INVALID_INPUT");
      const count = await prisma.gameMap.count();
      return prisma.gameMap.create({
        ...query,
        data: {
          slug,
          name: name.trim(),
          imageUrl: imageUrl?.trim() || null,
          serverMap: serverMapName(serverMap),
          sortOrder: count + 1,
        },
      });
    },
  }),
  updateMap: t.prismaField({
    type: "GameMap",
    authScopes: staff,
    args: {
      slug: t.arg.string({ required: true }),
      active: t.arg.boolean(),
      imageUrl: t.arg.string(),
      serverMap: t.arg.string(),
    },
    resolve: (query, _root, { slug, active, imageUrl, serverMap }) =>
      prisma.gameMap.update({
        ...query,
        where: { slug },
        data: {
          active: active ?? undefined,
          imageUrl: imageUrl === undefined ? undefined : imageUrl?.trim() || null,
          serverMap: serverMap === undefined ? undefined : serverMapName(serverMap),
        },
      }),
  }),
}));
