import { jsonProperty } from 'jconv';

class FileLink {
  @jsonProperty('href')
  public url: string;
}

export default FileLink;
