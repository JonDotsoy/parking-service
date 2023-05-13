import { z } from "npm:zod";

export abstract class Instance<T extends z.Schema> {
  constructor(readonly schema: T) {}

  abstract insertOne(doc: z.TypeOf<T>): Promise<z.TypeOf<T>>;
}
