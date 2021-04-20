import RequestInit from './RequestInit';

interface IDiskApiProvider {
  tryToLoadJsonData<T>(): (path: string, init?: RequestInit) => Promise<T>;
  tryToLoadJsonData<T>(ReturnType?: new () => T): (path: string, init?: RequestInit) => Promise<T>;
  tryToLoadJsonData<T>(
    ReturnType?: [new () => T],
  ): (path: string, init?: RequestInit) => Promise<T[]>;
  tryToLoadPlainText(path: string, init?: RequestInit): Promise<string>;
}

export default IDiskApiProvider;
