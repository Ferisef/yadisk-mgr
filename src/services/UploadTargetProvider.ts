import FileLink from '../models/FileLink';
import IDiskApiProvider from './interfaces/IDiskApiProvider';
import IUploadTargetProvider from './interfaces/IUploadTargetProvider';

class UploadTargetProvider implements IUploadTargetProvider {
  private readonly _diskApiProvider: IDiskApiProvider;

  public constructor(diskApiProvider: IDiskApiProvider) {
    this._diskApiProvider = diskApiProvider;
  }

  public get = async (savePath: string) => {
    const res = await this._diskApiProvider.tryToLoadJsonData(FileLink)('/resources/upload', {
      method: 'GET',
      queryParams: {
        path: savePath,
      },
    });

    return res.url;
  };
}

export default UploadTargetProvider;
