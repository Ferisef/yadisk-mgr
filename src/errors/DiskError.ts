class DiskError extends Error {
  public readonly innerError?: Error;

  public constructor(message?: string, innerError?: Error) {
    super(message);
    this.name = this.constructor.name;

    this.innerError = innerError;
  }
}

export default DiskError;
