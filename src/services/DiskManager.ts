import ResourceType from '../enums/ResourceType';
import BadPathPart from '../errors/BadPathPart';
import InvalidResourceType from '../errors/InvalidResourceType';
import StringExtensions from '../utils/StringUtils';
import FileLink from '../models/FileLink';
import Resource from '../models/Resource';
import ResourceMetadata from '../models/ResourceMetadata';
import Resources from '../models/Resources';
import StatusData from '../models/StatusData';
import PathUtils from '../utils/PathUtils';
import DiskInstance from './DiskInstance';
import DiskInstanceProvider from './DiskInstanceProvider';
import DirListOptions from './interfaces/DirListOptions';
import FileUploadOptions from './interfaces/FileUploadOptions';
import IDiskInstanceProvider from './interfaces/IDiskInstanceProvider';
import IDiskManager from './interfaces/IDiskManager';

class DiskManager implements IDiskManager {
  private readonly _diskInstanceProvider: IDiskInstanceProvider;

  public constructor(...tokens: string[]) {
    this._diskInstanceProvider = new DiskInstanceProvider(
      tokens.map((token) => new DiskInstance(token)),
    );
  }

  public async getStatus(): Promise<StatusData> {
    const statuses = await Promise.all(
      this._diskInstanceProvider.items.map((instance) => instance.getStatus()),
    );

    return statuses.reduce((acc, val) => ({
      totalSpace: acc.totalSpace + val.totalSpace,
      usedSpace: acc.usedSpace + val.usedSpace,
    }));
  }

  public createDir(path: string): Promise<boolean> {
    const { disk, pathOnDisk } = this.getDiskAndPath(path);
    return disk.createDir(pathOnDisk);
  }

  public getResourceMetadata(path: string): Promise<ResourceMetadata> {
    if (path === '/') {
      return Promise.resolve({ type: ResourceType.Directory });
    }

    const { disk, pathOnDisk } = this.getDiskAndPath(path, true);
    return disk.getResourceMetadata(pathOnDisk);
  }

  public getDirList(path: string, options?: DirListOptions): Promise<Resources> {
    if (path === '/') {
      const resources = new Resources();
      resources.resources = this._diskInstanceProvider.items.map((instance) => {
        const resource = new Resource();
        resource.name = instance.id;
        resource.type = ResourceType.Directory;

        return resource;
      });

      return Promise.resolve(resources);
    }

    const { disk, pathOnDisk } = this.getDiskAndPath(path, true);
    return disk.getDirList(pathOnDisk, options);
  }

  public getFileLink(path: string): Promise<FileLink> {
    if (path === '/') {
      throw new InvalidResourceType();
    }

    const { disk, pathOnDisk } = this.getDiskAndPath(path);
    return disk.getFileLink(pathOnDisk);
  }

  public async uploadFile(buffer: Buffer, options?: FileUploadOptions): Promise<string> {
    const instance = await this.getLeastLoadedInstance();
    const pathOnDisk = await instance.uploadFile(buffer, options);

    return PathUtils.combine('/', instance.id, pathOnDisk);
  }

  public deleteResource(path: string): Promise<boolean> {
    if (path === '/') {
      throw new BadPathPart(path);
    }

    const { disk, pathOnDisk } = this.getDiskAndPath(path);
    return disk.deleteResource(pathOnDisk);
  }

  private getDiskAndPath(path: string, addTrailingSlash: boolean = false) {
    let path1 = StringExtensions.removeLeadingChar(path, '/');
    if (addTrailingSlash) {
      path1 = StringExtensions.addTrailingChar(path1, '/');
    }

    const slashIndex = path1.indexOf('/');
    if (slashIndex === -1) {
      throw new BadPathPart(path);
    }

    const id = path1.substring(0, slashIndex);
    const disk = this._diskInstanceProvider.get(id);

    return {
      pathOnDisk: path1.substring(slashIndex),
      disk,
    };
  }

  private async getLeastLoadedInstance() {
    const statuses = await Promise.all(
      this._diskInstanceProvider.items.map<Promise<[StatusData, string]>>(async (instance) => [
        await instance.getStatus(),
        instance.id,
      ]),
    );

    const leastLoadedInstance = statuses.sort(
      ([statusA], [statusB]) =>
        statusA.totalSpace - statusA.usedSpace + statusB.totalSpace - statusB.usedSpace,
    )[0];

    return this._diskInstanceProvider.get(leastLoadedInstance[1]);
  }
}

export default DiskManager;
