import FileLink from '../../models/FileLink';
import ResourceMetadata from '../../models/ResourceMetadata';
import Resources from '../../models/Resources';
import StatusData from '../../models/StatusData';
import DirListOptions from './DirListOptions';
import UploadFileOptions from './FileUploadOptions';

interface IDiskInstance {
  id: string;
  getStatus(): Promise<StatusData>;
  createDir(path: string): Promise<boolean>;
  getResourceMetadata(path: string): Promise<ResourceMetadata>;
  getDirList(path: string, options?: DirListOptions): Promise<Resources>;
  getFileLink(path: string): Promise<FileLink>;
  uploadFile(buffer: Buffer, options?: UploadFileOptions): Promise<any>;
  deleteResource(path: string): Promise<boolean>;
}

export default IDiskInstance;
