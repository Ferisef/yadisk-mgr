import { jsonProperty } from 'jconv';

class ApiError {
  @jsonProperty('message')
  public message: string;

  @jsonProperty('description')
  public description: string;

  @jsonProperty('error')
  public errorCode: string;
}

export default ApiError;
