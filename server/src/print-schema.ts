// Writes schema.graphql, which the frontend uses for typed queries (gql.tada).
import { writeFileSync } from "node:fs";
import { printSchema } from "graphql";
import { schema } from "./schema/index.js";

writeFileSync(new URL("../schema.graphql", import.meta.url), printSchema(schema) + "\n");
console.info("Wrote server/schema.graphql");
process.exit(0);
