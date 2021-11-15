import { Logger } from '../logging/logger';

export class Environment {
  public readonly logger: Logger = new Logger('env');
  public readonly DB_STORE_PORT: number;
  public readonly DATABASE_URI: string;

  constructor() {
    this.DB_STORE_PORT = parseInt(process.env.DB_STORE_PORT);
    this.DATABASE_URI = process.env.DATABASE_URI;
  }

  public validKeys(): boolean {
    if (isNaN(this.DB_STORE_PORT)) {
      this.logger.error('validKeys', `Invalid environment variable for DB_STORE_PORT: ${this.DB_STORE_PORT}`);
      return false;
    }
    else if (!this.DATABASE_URI) {
      this.logger.error('validKeys', `Invalid environment variable for DATABASE_URI: ${this.DATABASE_URI}`);
      return false;
    }
    return true;
  }
}