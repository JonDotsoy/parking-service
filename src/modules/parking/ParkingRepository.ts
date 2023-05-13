import { Parking, parking } from "../../lib/db/models/Parking.model.ts";

export class ParkingRepository {
  constructor() {}

  async findById(id: string): Promise<Parking> {
    throw new Error("Not implemented yet");
  }

  async findMany(): Promise<Parking[]> {
    const elms: Parking[] = [];
    for await (const v of parking.find()) {
      elms.push(v);
    }
    return elms.sort((a, b) => a.id! < b.id! ? 1 : a.id! > b.id! ? -1 : 0);
  }

  async createOne(value: Parking) {
    return await parking.insertOne(value);
  }
}
