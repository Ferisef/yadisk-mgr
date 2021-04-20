import { jsonProperty } from 'jconv';
import ResourceType from '../enums/ResourceType';

class Resource {
  @jsonProperty('name')
  public name: string;

  @jsonProperty('type')
  public type: ResourceType;

  @jsonProperty('media_type')
  public mediaType?: string;

  @jsonProperty('size')
  public size?: number;

  @jsonProperty('created', Date)
  public createdAt?: Date;

  @jsonProperty('modified', Date)
  public updatedAt?: Date;
}

export default Resource;
