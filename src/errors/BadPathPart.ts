import DiskError from './DiskError';

class BadPathPart extends DiskError {
  public constructor(path: string) {
    super(`Specified path "${path}" doesn't exists.`);
  }
}

export default BadPathPart;
