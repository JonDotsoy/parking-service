export class GQLError {
  readonly __typename = "Error" as const;
  constructor(
    readonly error: string,
    readonly errorDescription: string,
  ) {}
}
