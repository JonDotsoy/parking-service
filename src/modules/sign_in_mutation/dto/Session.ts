export class Session {
  readonly __typename = "Session" as const;

  constructor(
    readonly tokenType: string,
    readonly accessToken: string,
    readonly expiresIn: number,
  ) {}
}
