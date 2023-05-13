import { z } from "npm:zod";
import * as b from "./datasource.ts";
import { ulid } from "npm:ulid";

export const optionSchema = z.object({ s: z.string() });

export class Datasource {}

export class Interface<T extends z.Schema> extends b.Instance<T> {
  constructor(readonly schema: T, readonly baseStore: URL) {
    super(schema);
  }

  async *find() {
    for await (const entry of Deno.readDir(this.baseStore)) {
      yield this.schema.parse(
        JSON.parse(
          await Deno.readTextFile(new URL(entry.name, this.baseStore)),
        ),
      );
    }
  }

  async insertOne(doc: z.TypeOf<T>): Promise<z.TypeOf<T>> {
    const parsed = this.schema.parse(doc);
    const entry = { id: parsed.id ?? ulid(), ...parsed };
    const location = new URL(`${entry.id}.json`, this.baseStore);
    await Deno.writeTextFile(location, JSON.stringify(entry, null, 2));
    return entry;
  }

  async insertMany(docs: z.TypeOf<T>[]): Promise<void> {
    for (const doc of docs) {
      await this.insertOne(doc);
    }
  }
}
