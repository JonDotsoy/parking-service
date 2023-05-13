import { zodToJsonSchema } from "npm:zod-to-json-schema";
import * as YAML from "npm:yaml";
import { CollectionSchema } from "../schemas/collection.schema.ts";

export const schemaHandler = async (output: string): Promise<number> => {
  const jsonSchema = zodToJsonSchema(CollectionSchema);

  const schemaUrl = new URL("../collection.schema.json", import.meta.url);

  await Deno.writeTextFile(schemaUrl, JSON.stringify(jsonSchema, null, 2));

  console.error(`### URL Schema: ${schemaUrl}`);

  if (output === "json") {
    console.log(JSON.stringify(jsonSchema, null, 2));
    return 0;
  }

  if (output === "yaml") {
    console.log(YAML.stringify(jsonSchema));
    return 0;
  }

  return 101;
};
