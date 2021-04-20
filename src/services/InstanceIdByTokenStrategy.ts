import HashUtils from '../utils/HashUtils';
import IInstanceIdCreationStrategy from './interfaces/IInstanceIdCreationStrategy';

class InstanceIdByTokenStrategy implements IInstanceIdCreationStrategy {
  private readonly _value: string;

  public constructor(token: string) {
    this._value = HashUtils.createHash(token).substring(0, 4);
  }

  public get() {
    return this._value;
  }
}

export default InstanceIdByTokenStrategy;
