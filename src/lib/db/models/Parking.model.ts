import { z } from "npm:zod";
import { Interface } from "../stone.db/datasource/local.ts";

export const ParkingSchema = z.object({
  id: z.string().optional(),
  location: z.string(),
  owner: z.string(),
  createdAt: z.number(),
});

export type Parking = z.TypeOf<typeof ParkingSchema>;

export const parking = new Interface(
  ParkingSchema,
  new URL("_Parking/", import.meta.url),
);
