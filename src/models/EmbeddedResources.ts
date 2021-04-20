import { jsonProperty } from 'jconv';
import Resources from './Resources';

class EmbeddedResources {
  @jsonProperty('_embedded', Resources)
  public embedded: Resources;
}

export default EmbeddedResources;
