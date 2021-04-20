import buildUrl from 'build-url';
import JsonConvert from 'jconv';
import fetch from 'node-fetch';
import DiskError from '../errors/DiskError';
import ApiError from '../models/errors/ApiError';
import RequestInit from './interfaces/RequestInit';
import IDiskApiProvider from './interfaces/IDiskApiProvider';

class DiskApiProvider implements IDiskApiProvider {
  private readonly _apiAddress = 'https://cloud-api.yandex.net/v1/disk/';

  private readonly _token: string;

  public constructor(token: string) {
    this._token = token;
  }

  public tryToLoadJsonData<T>(): (path: string, init?: RequestInit) => Promise<T>;

  public tryToLoadJsonData<T>(
    ReturnType: new () => T,
  ): (path: string, init?: RequestInit) => Promise<T>;

  public tryToLoadJsonData<T>(
    ReturnType: [new () => T],
  ): (path: string, init?: RequestInit) => Promise<T[]>;

  public tryToLoadJsonData(ReturnType?: any) {
    return async (path: string, init?: RequestInit) => {
      return JsonConvert.deserialize(ReturnType)(await this.tryToLoadPlainText(path, init));
    };
  }

  public async tryToLoadPlainText(path: string, init?: RequestInit) {
    const requestInit = {
      ...init,
      headers: {
        authorization: `OAuth ${this._token}`,
        ...init?.headers,
      },
    };

    const url = buildUrl(this._apiAddress, { path, queryParams: init?.queryParams });
    const res = await fetch(url, requestInit);
    const plainText = await res.text();

    if (!res.ok) {
      const jObject = JsonConvert.deserialize(ApiError)(plainText);
      throw new DiskError(jObject.description, new Error(jObject.errorCode));
    }

    return plainText;
  }
}

export default DiskApiProvider;
