import DiskError from '../errors/DiskError';
import DiskInstance from './DiskInstance';
import IDiskInstanceProvider from './interfaces/IDiskInstanceProvider';

class DiskInstanceProvider implements IDiskInstanceProvider {
  private readonly _map: Map<string, DiskInstance>;

  public constructor(instances: DiskInstance[]) {
    this._map = new Map<string, DiskInstance>(instances.map((instance) => [instance.id, instance]));
  }

  public set(instance: DiskInstance) {
    this._map.set(instance.id, instance);
    return this;
  }

  public get(id: string) {
    const instance = this._map.get(id);
    if (typeof instance === 'undefined') {
      throw new DiskError();
    }

    return instance;
  }

  public tryGet(id: string) {
    return this._map.get(id) ?? null;
  }

  public has(id: string): boolean {
    return this._map.has(id);
  }

  public delete(id: string): boolean {
    return this._map.delete(id);
  }

  public get items() {
    return Array.from(this._map.values());
  }
}

export default DiskInstanceProvider;
