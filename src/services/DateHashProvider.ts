import HashUtils from '../utils/HashUtils';
import IDateHashProvider from './interfaces/IDateHashProvider';

class DateHashProvider implements IDateHashProvider {
  private readonly _value: string;

  public constructor() {
    this._value = HashUtils.createHash(Date.now().toString());
  }

  public get value() {
    return this._value;
  }
}

export default DateHashProvider;
