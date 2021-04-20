import { jsonProperty } from 'jconv';
import ResourceType from '../enums/ResourceType';

class ResourceMetadata {
  @jsonProperty('type')
  public type: ResourceType;
}

export default ResourceMetadata;
