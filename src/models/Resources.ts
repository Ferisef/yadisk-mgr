import { jsonProperty } from 'jconv';
import SortBy from '../enums/SortBy';
import Resource from './Resource';

class Resources {
  @jsonProperty('sort')
  public sortBy: SortBy;

  @jsonProperty('items', [Resource])
  public resources: Resource[];
}

export default Resources;
