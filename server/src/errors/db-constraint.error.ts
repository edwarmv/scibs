export class DbConstraintError extends Error {
  constructor(message: string) {
    super(message);
  }
}
