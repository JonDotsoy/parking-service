import { z } from "npm:zod";
import * as LocalDataSource from "../datasource/local.ts";

interface DataSourceModule {
  optionSchema: z.ZodObject<any, "strip", z.ZodTypeAny, any, any>;
}

const DataSources = {
  local: LocalDataSource,
  sample: LocalDataSource,
} satisfies Record<string, DataSourceModule>;

const enumTypeEnabled = z.enum(["string", "number", "boolean"]);

const fileUrl = z.string().regex(/^file\:.+\/$/).url();

const LocalStorageGenerator = z.object({
  output: fileUrl.default("file:./models/"),
});

const Generator = LocalStorageGenerator;

const propertyModel = z.object({
  description: z.optional(z.string()),
  type: enumTypeEnabled,
  index: z.optional(z.boolean()),
  optional: z.optional(z.boolean()),
}).describe("Property of model");

type Multi<T> = [T, T];

function createKeys<K, T extends { [k: string]: DataSourceModule }>(
  obj: T,
): z.ZodEnum<[any, ...any[]]> {
  return z.enum(Object.keys(obj) as any) as any;
}

function createUnion<T extends { [k: string]: DataSourceModule }>(
  obj: T,
): Multi<
  z.ZodObject<{
    type: z.ZodLiteral<keyof T>;
    options: z.ZodOptional<T[keyof T]["optionSchema"]>;
  }>
> {
  return Array.from(
    Object.entries(obj),
  ).map((
    [k, v]: [keyof T, DataSourceModule],
  ) =>
    z.object({
      type: z.literal(k),
      options: z.optional(v.optionSchema),
    })
  ) as any;
}

export const CollectionSchema = z.object({
  datasources: z.optional(z.record(z.union(createUnion(DataSources)))).default({
    default: { type: "local" },
  }).describe(
    `Datasource describe the connection with the origin data`,
  ).default({}),
  generator: z.optional(Generator).default({}),
  models: z.record(
    z.string().regex(/^[A-Z][a-zA-Z0-9]*$/),
    z.object({
      output: z.optional(fileUrl),
      datasource: z.optional(z.string()),
      properties: z.record(
        z.string().regex(/^[a-zA-Z0-9]*$/),
        propertyModel,
      ),
    })
      .describe("Model"),
  ),
});
