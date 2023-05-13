import { AccountRepository } from "./AccountRepository.ts";

export class AccountModule {
  constructor(
    readonly accountRepository: AccountRepository,
  ) {}
}
