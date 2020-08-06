import { v4 as uuid } from 'uuid';

export default class CriticalFailure extends Error {
  public readonly err: Error;
  public readonly code = 500;
  public readonly id: string;

  constructor(err: Error) {
    super();
    this.err = err;
    this.id = uuid();
    this.message = `Critical Failure. Correlation ID: ${this.id}`;
  }
}
