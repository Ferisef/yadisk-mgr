import DiskError from './DiskError';

class DiskNotFound extends DiskError {
  public constructor(diskId: string) {
    super(`Disk "${diskId}" not found.`);
  }
}

export default DiskNotFound;
