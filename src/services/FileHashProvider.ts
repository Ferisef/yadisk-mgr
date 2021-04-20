import HashUtils from '../utils/HashUtils';
import IFileHashProvider from './interfaces/IFileHashProvider';

class FileHashProvider implements IFileHashProvider {
  private readonly _value: string;

  public constructor(data: Buffer) {
    this._value = HashUtils.createHash(data);
  }

  public get value() {
    return this._value;
  }
}

export default FileHashProvider;
