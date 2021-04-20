import DiskInstance from '../DiskInstance';

interface IDiskInstanceProvider {
  set(instance: DiskInstance): IDiskInstanceProvider;
  get(id: string): DiskInstance;
  tryGet(id: string): DiskInstance | null;
  has(id: string): boolean;
  delete(id: string): boolean;
  items: DiskInstance[];
}

export default IDiskInstanceProvider;
