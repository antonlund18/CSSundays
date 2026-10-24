// Generates src/graphql-env.d.ts (schema types for gql.tada) from server/schema.graphql.
// Equivalent to `gql.tada generate output`, without the CLI.
import { writeFile } from "node:fs/promises";
import { loadFromSDL, minifyIntrospection, outputIntrospectionFile } from "@gql.tada/internal";

const loader = loadFromSDL({ file: new URL("../../server/schema.graphql", import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });
const introspection = await loader.loadIntrospection();
const output = outputIntrospectionFile(minifyIntrospection(introspection), {
  fileType: "src/graphql-env.d.ts",
  shouldPreprocess: true,
});
await writeFile(new URL("../src/graphql-env.d.ts", import.meta.url), output);
console.info("Wrote web/src/graphql-env.d.ts");
