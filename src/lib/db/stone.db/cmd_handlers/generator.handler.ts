import * as path from "https://deno.land/std@0.187.0/path/mod.ts";
import * as YAML from "npm:yaml";
import { CollectionSchema } from "../schemas/collection.schema.ts";

export const generatorHandler = async (
  relativeLocation: string,
  localDataSourceLocation: URL,
) => {
  const location = new URL(relativeLocation, `file://${Deno.cwd()}/`);

  const spec = CollectionSchema.parse(
    YAML.parse(await Deno.readTextFile(location)),
  );

  for (const [modelName, model] of Object.entries(spec.models)) {
    const modelSchemaLocation = new URL(
      `${modelName}.model.ts`,
      new URL(model.output ?? spec.generator.output, location),
    );
    const modelStoreLocation = new URL(
      `./_${modelName}/`,
      modelSchemaLocation,
    );
    await Deno.mkdir(new URL(".", modelSchemaLocation), {
      recursive: true,
    });
    await Deno.mkdir(modelStoreLocation, { recursive: true });

    let fileCollectionPayload = ``;
    const ln: typeof String.raw = (...args) =>
      fileCollectionPayload += `${String.raw(...args)}\n`;

    const dependenciesPayload = new Map<string, string>();

    dependenciesPayload.set("z", "npm:zod");
    dependenciesPayload.set(
      `Interface`,
      `${
        path.relative(
          new URL(".", modelSchemaLocation).pathname,
          localDataSourceLocation.pathname,
        )
      }`,
    );

    ln`export const ${modelName}Schema = z.object({`;

    class FCall {
      constructor(private invokes: (string | FCall)[]) {}

      call(invoke: string | FCall) {
        this.invokes.push(invoke);
      }

      toString(): string {
        return this.invokes.map((e) => e.toString()).join(".");
      }
    }

    for (const [propName, prop] of Object.entries(model.properties)) {
      const zodString = new FCall(["z"]);

      zodString.call(`${prop.type}()`);

      if (prop.description) {
        zodString.call(`describe(${JSON.stringify(prop.description)})`);
      }

      if (prop.optional) zodString.call("optional()");

      ln`  ${propName}: ${zodString},`;
    }

    ln`});`;

    ln``;
    ln`export type ${modelName} = z.TypeOf<typeof ${modelName}Schema>;`;
    ln``;
    ln`export const parking = new Interface(ParkingSchema, new URL(${
      JSON.stringify(
        `${
          path.relative(
            new URL(".", modelSchemaLocation).pathname,
            modelStoreLocation.pathname,
          )
        }/`,
      )
    }, import.meta.url));`;

    const headPayload = Array.from(dependenciesPayload.entries()).map((
      [name, mod],
    ) => `import { ${name} } from "${mod}";\n`).join(``);

    await Deno.writeTextFile(
      modelSchemaLocation,
      `${headPayload}\n${fileCollectionPayload}`,
    );
  }

  return 0;
};
