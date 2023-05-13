import { ParkingMutation } from "./ParkingMutation.ts";
import { ParkingQuery } from "./ParkingQuery.ts";

export class ParkingModule {
  constructor(
    readonly parkingQuery: ParkingQuery,
    readonly parkingMutation: ParkingMutation,
  ) {}
}
