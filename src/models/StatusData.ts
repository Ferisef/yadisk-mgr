import { jsonProperty } from 'jconv';

class StatusData {
  @jsonProperty('total_space')
  public totalSpace: number;

  @jsonProperty('used_space')
  public usedSpace: number;
}

export default StatusData;
