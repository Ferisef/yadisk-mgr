import Bluebird from 'bluebird';
import fetch from 'node-fetch';
import ResourceType from '../enums/ResourceType';
import BadPathPart from '../errors/BadPathPart';
import DiskError from '../errors/DiskError';
import InvalidResourceType from '../errors/InvalidResourceType';
import EmbeddedResources from '../models/EmbeddedResources';
import FileLink from '../models/FileLink';
import ResourceMetadata from '../models/ResourceMetadata';
import StatusData from '../models/StatusData';
import PathUtils from '../utils/PathUtils';
import DateHashProvider from './DateHashProvider';
import DiskApiProvider from './DiskApiProvider';
import DiskInstanceConstants from './DiskInstanceConstants';
import FileHashProvider from './FileHashProvider';
import FileUploadDataProvider from './FileUploadDataProvider';
import InstanceIdByTokenStrategy from './InstanceIdByTokenStrategy';
import DirListOptions from './interfaces/DirListOptions';
import UploadFileOptions from './interfaces/FileUploadOptions';
import IDiskApiProvider from './interfaces/IDiskApiProvider';
import IDiskInstance from './interfaces/IDiskInstance';
import IUploadTargetProvider from './interfaces/IUploadTargetProvider';
import UploadTargetProvider from './UploadTargetProvider';
import IInstanceIdCreationStrategy from './interfaces/IInstanceIdCreationStrategy';

class DiskInstance implements IDiskInstance {
  private readonly _instanceId: IInstanceIdCreationStrategy;

  private readonly _diskApiProvider: IDiskApiProvider;

  private readonly _uploadTargetProvider: IUploadTargetProvider;

  public constructor(token: string) {
    this._instanceId = new InstanceIdByTokenStrategy(token);
    this._diskApiProvider = new DiskApiProvider(token);
    this._uploadTargetProvider = new UploadTargetProvider(this._diskApiProvider);
  }

  public get id() {
    return this._instanceId.get();
  }

  public async getStatus() {
    const res = await this._diskApiProvider.tryToLoadJsonData(StatusData)('/', { method: 'GET' });
    return res;
  }

  public async createDir(path: string) {
    await this._diskApiProvider.tryToLoadPlainText('/resources', {
      method: 'PUT',
      queryParams: { path },
    });

    return true;
  }

  public async getResourceMetadata(path: string) {
    const res = await this._diskApiProvider.tryToLoadJsonData(ResourceMetadata)('/resources', {
      queryParams: { path, fields: DiskInstanceConstants.metadataFields },
    });

    return res;
  }

  public async getDirList(path: string, options?: DirListOptions) {
    const resourceMetadata = await this.getResourceMetadata(path);
    if (resourceMetadata.type !== ResourceType.Directory) {
      throw new InvalidResourceType();
    }
    const res = await this._diskApiProvider.tryToLoadJsonData(EmbeddedResources)('/resources', {
      queryParams: { path, ...options, fields: DiskInstanceConstants.dirListFields },
    });

    return res.embedded;
  }

  public async getFileLink(path: string) {
    const resourceMetadata = await this.getResourceMetadata(path);
    if (resourceMetadata.type !== ResourceType.File) {
      throw new InvalidResourceType();
    }

    const res = await this._diskApiProvider.tryToLoadJsonData(FileLink)('/resources/download', {
      queryParams: { path },
    });

    return res;
  }

  public async uploadFile(buffer: Buffer, options?: UploadFileOptions) {
    const fileHashProvider = new FileHashProvider(buffer);
    const dateHashProvider = new DateHashProvider();

    const fileUploadDataProvider = new FileUploadDataProvider(fileHashProvider, dateHashProvider);
    if (options?.folder) {
      fileUploadDataProvider.folder = options.folder;
    }

    if (options?.filename) {
      fileUploadDataProvider.filename = options.filename;
    }

    if (options?.extension) {
      fileUploadDataProvider.extension = options.extension;
    }

    await this.createNestedDirectories(fileUploadDataProvider.folder);

    const { savePath } = fileUploadDataProvider;
    const uploadTargetUrl = await this._uploadTargetProvider.get(savePath);

    const res = await fetch(uploadTargetUrl, { method: 'PUT', body: buffer });
    if (!res.ok) {
      throw new DiskError('Something went wrong while uploading file.', new Error(res.statusText));
    }

    return savePath;
  }

  public async deleteResource(path: string) {
    await this._diskApiProvider.tryToLoadPlainText('/resources', {
      method: 'DELETE',
      queryParams: { path, permanently: 'true' },
    });

    return true;
  }

  private async createNestedDirectories(path: string) {
    const pathParts = PathUtils.split(path);
    await Bluebird.reduce(
      pathParts,
      async (createdPath, pathPart) => {
        const currentPath = PathUtils.combine(createdPath, pathPart);

        try {
          const resourceMetadata = await this.getResourceMetadata(currentPath);
          if (resourceMetadata.type !== ResourceType.Directory) {
            throw new BadPathPart(currentPath);
          }
        } catch (e) {
          if (e instanceof BadPathPart) {
            throw e;
          }

          await this.createDir(currentPath);
        }

        return currentPath;
      },
      '/',
    );
  }
}

export default DiskInstance;
