import IDateHashProvider from './interfaces/IDateHashProvider';
import PathUtils from '../utils/PathUtils';
import IFileHashProvider from './interfaces/IFileHashProvider';
import StringExtensions from '../utils/StringUtils';

class FileUploadDataProvider {
  private readonly _fileHashProvider: IFileHashProvider;

  private readonly _dateHashProvider: IFileHashProvider;

  private _folder: string;

  private _filename: string;

  private _extension: string;

  public constructor(fileHashProvider: IFileHashProvider, dateHashProvider: IDateHashProvider) {
    this._fileHashProvider = fileHashProvider;
    this._dateHashProvider = dateHashProvider;

    this._folder = this._fileHashProvider.value.substr(0, 6);
    this.filename = this._dateHashProvider.value;
  }

  public get savePath() {
    return PathUtils.combine('/', this._folder, this._filename, this._extension);
  }

  public set folder(value: string) {
    this._folder = value;
    this._filename = this._fileHashProvider.value;
  }

  public get folder() {
    return this._folder;
  }

  public set filename(value: string) {
    this._filename = value;
  }

  public get filename() {
    return this._filename;
  }

  public set extension(value: string) {
    this._extension = StringExtensions.addLeadingChar(value, '.');
  }

  public get extension() {
    return this._extension;
  }
}

export default FileUploadDataProvider;
