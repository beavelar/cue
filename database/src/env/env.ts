import { Logger } from '../logging/logger';

export class Environment {
  public readonly logger: Logger = new Logger('env');
  public readonly DB_STORE_PORT: number;

  constructor() {
    this.DB_STORE_PORT = parseInt(process.env.DB_STORE_PORT);
  }

  public validKeys(): boolean {
    if (isNaN(this.DB_STORE_PORT)) {
      this.logger.error('validKeys', `Invalid environment variable for DB_STORE_PORT: ${this.DB_STORE_PORT}`);
      return false;
    }
    return true;
  }
}