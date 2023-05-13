import { GQLError } from "../../dto/GQLError.ts";
import { Session } from "./dto/Session.ts";

export class SignInMutation {
  signIn(_username: string, _password: string): Session | GQLError {
    return new Session("Bearer", "abc", 3600);
  }
}
