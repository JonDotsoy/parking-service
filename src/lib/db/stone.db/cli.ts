import * as flags from "https://deno.land/std@0.182.0/flags/mod.ts";
import { schemaHandler } from "./cmd_handlers/schema.handler.ts";
import { generatorHandler } from "./cmd_handlers/generator.handler.ts";

const localDataSourceLocation = new URL(
  "./datasource/local.ts",
  import.meta.url,
);

const cli = async (args: string[]): Promise<number> => {
  const { _: commands, output = "json" } = flags.parse(args, {
    alias: { o: "output" },
    string: ["output"],
  });

  const argumentRequired = (name: string, arg: string | number | undefined) => {
    if (!arg) throw new Error(`Missing ${name} argument`);
    return arg;
  };

  switch (commands.at(0)) {
    case "schema":
      return await schemaHandler(output);
    case "generate":
      return await generatorHandler(
        argumentRequired("<spec_file>", commands.at(1)).toString(),
        localDataSourceLocation,
      );
  }

  console.error(`Invalid command`);

  return 1;
};

Deno.exit(await cli(Deno.args));
