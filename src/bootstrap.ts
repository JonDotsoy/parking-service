import { App } from "./app.ts";
import { ParkingModule } from "./modules/parking/ParkingModule.ts";
import { ParkingMutation } from "./modules/parking/ParkingMutation.ts";
import { ParkingQuery } from "./modules/parking/ParkingQuery.ts";
import { ParkingRepository } from "./modules/parking/ParkingRepository.ts";

import { SignInMutation } from "./modules/sign_in_mutation/SignIn.mutation.ts";

const parkingRepository = new ParkingRepository();

export const app = new App(
  new SignInMutation(),
  new ParkingModule(
    new ParkingQuery(parkingRepository),
    new ParkingMutation(parkingRepository),
  ),
);
