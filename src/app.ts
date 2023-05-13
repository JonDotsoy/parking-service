import { ParkingModule } from "./modules/parking/ParkingModule.ts";

import { SignInMutation } from "./modules/sign_in_mutation/SignIn.mutation.ts";

export class App {
  constructor(
    readonly signInMutation: SignInMutation,
    readonly parkingModule: ParkingModule,
  ) {}
}
