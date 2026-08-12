export class Result<T, E = Error> {
  private readonly _value: T | null;
  private readonly _error: E | null;

  private constructor(
    private readonly ok: boolean,
    value: T | null,
    error: E | null,
  ) {
    this._value = value;
    this._error = error;
  }

  static success<T>(value: T): Result<T, Error> {
    return new Result<T, Error>(true, value, null);
  }

  static error<T = never, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, null, error);
  }

  get isSuccess(): boolean {
    return this.ok;
  }

  get isError(): boolean {
    return !this.ok;
  }

  get value(): T | null {
    return this._value;
  }

  get error(): E | null {
    return this._error;
  }
}