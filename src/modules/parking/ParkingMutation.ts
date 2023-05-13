import { Parking } from "../../lib/db/models/Parking.model.ts";
import { ParkingRepository } from "./ParkingRepository.ts";

export class ParkingMutation {
  constructor(
    readonly parkingRepository: ParkingRepository,
  ) {}

  async createParking(
    { location }: Pick<Parking, "location">,
  ): Promise<any> {
    const parking: Parking = {
      location,
      createdAt: Date.now(),
      owner: "demo",
    };

    return await this.parkingRepository.createOne(parking);
  }
}
