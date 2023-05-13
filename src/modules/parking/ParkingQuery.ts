import { Parking } from "../../lib/db/models/Parking.model.ts";
import { ParkingRepository } from "./ParkingRepository.ts";

export class ParkingQuery {
  constructor(
    readonly parkingRepository: ParkingRepository,
  ) {}

  async parkingCollection(): Promise<Parking[]> {
    return this.parkingRepository.findMany();
  }
}
