import { Logger } from '../logging/logger';

export class Environment {
  public readonly logger: Logger = new Logger('env');
  public readonly PROXY_PORT: number;

  constructor() {
    this.PROXY_PORT = 3001;
  }

  public validKeys(): boolean {
    if (isNaN(this.PROXY_PORT)) {
      this.logger.error('validKeys', `Invalid environment variable for PROXY_PORT: ${this.PROXY_PORT}`);
      return false;
    }
    return true;
  }
}