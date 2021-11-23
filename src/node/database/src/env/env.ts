import { Logger } from '../logging/logger';

/**
 * Interface which will be responsible for containing the application environment
 * variables.
 */
export class Environment {
  /** Logger for Environment */
  public readonly logger: Logger = new Logger('env');

  /** The DB-Store port */
  public readonly DB_STORE_PORT: number;

  /** The database uri */
  public readonly DATABASE_URI: string;

  constructor() {
    try {
      this.DB_STORE_PORT = parseInt(process.env.DB_STORE_PORT);
    }
    catch {
      this.logger.critical('Environment', `Invalid DB_STORE_PORT environment variable provided: ${process.env.DB_STORE_PORT}`);
      this.DB_STORE_PORT = NaN;
    }

    this.DATABASE_URI = process.env.DATABASE_URI;
  }

  /**
   * Determines if the environment variables are valid or not.
   * 
   * @returns Boolean indicating if the environment variables are valid
   */
  public validKeys(): boolean {
    let valid = true;
    if (isNaN(this.DB_STORE_PORT)) {
      this.logger.critical('validKeys', `Invalid environment variable for DB_STORE_PORT: ${this.DB_STORE_PORT}`);
      valid = false;
    }
    if (!this.DATABASE_URI) {
      this.logger.critical('validKeys', `Invalid environment variable for DATABASE_URI: ${this.DATABASE_URI}`);
      valid = false;
    }
    if (valid) {
      this.logger.info('validKeys', `DB-Store Server Port: ${this.DB_STORE_PORT}`);
      this.logger.info('validKeys', `Database URI: ${this.DATABASE_URI}`);
    }
    return valid;
  }
}