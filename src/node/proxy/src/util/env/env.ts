import { Logger } from '../logging/logger';

/**
 * Interface which will be responsible for containing the application environment
 * variables.
 */
export class Environment {
  /** Logger for Environment */
  public readonly logger: Logger = new Logger('env');

  /** The proxy server port */
  public readonly PROXY_PORT: number;

  /** The historical server hostname */
  public readonly HISTORICAL_SERVER_HOSTNAME: string;

  /** The historical server port */
  public readonly HISTORICAL_SERVER_PORT: number;

  /** The realtime server hostname */
  public readonly REALTIME_SERVER_HOSTNAME: string;

  /** The realtime server port */
  public readonly REALTIME_SERVER_PORT: number;

  constructor() {
    try {
      this.PROXY_PORT = parseInt(process.env.PROXY_PORT);
    }
    catch {
      this.logger.critical('Environment', `Invalid PROXY_PORT environment variable provided: ${process.env.PROXY_PORT}`);
      this.PROXY_PORT = NaN;
    }

    try {
      this.HISTORICAL_SERVER_PORT = parseInt(process.env.HISTORICAL_SERVER_PORT);
    }
    catch {
      this.logger.critical('Environment', `Invalid HISTORICAL_SERVER_PORT environment variable provided: ${process.env.HISTORICAL_SERVER_PORT}`);
      this.HISTORICAL_SERVER_PORT = NaN;
    }

    try {
      this.REALTIME_SERVER_PORT = parseInt(process.env.REALTIME_SERVER_PORT);
    }
    catch {
      this.logger.critical('Environment', `Invalid REALTIME_SERVER_PORT environment variable provided: ${process.env.REALTIME_SERVER_PORT}`);
      this.REALTIME_SERVER_PORT = NaN;
    }

    this.HISTORICAL_SERVER_HOSTNAME = process.env.HISTORICAL_SERVER_HOSTNAME;
    this.REALTIME_SERVER_HOSTNAME = process.env.REALTIME_SERVER_HOSTNAME;
  }

  /**
   * Determines if the environment variables are valid or not.
   * 
   * @returns Boolean indicating if the environment variables are valid
   */
  public validKeys(): boolean {
    let valid = true;
    if (isNaN(this.PROXY_PORT)) {
      this.logger.critical('validKeys', `Invalid environment variable for PROXY_PORT: ${this.PROXY_PORT}`);
      valid = false;
    }
    if (!this.HISTORICAL_SERVER_HOSTNAME) {
      this.logger.critical('validKeys', `Invalid environment variable for HISTORICAL_SERVER_HOSTNAME: ${this.HISTORICAL_SERVER_HOSTNAME}`);
      valid = false;
    }
    if (isNaN(this.HISTORICAL_SERVER_PORT)) {
      this.logger.critical('validKeys', `Invalid environment variable for HISTORICAL_SERVER_PORT: ${this.HISTORICAL_SERVER_PORT}`);
      valid = false;
    }
    if (!this.REALTIME_SERVER_HOSTNAME) {
      this.logger.critical('validKeys', `Invalid environment variable for REALTIME_SERVER_HOSTNAME: ${this.REALTIME_SERVER_HOSTNAME}`);
      valid = false;
    }
    if (isNaN(this.REALTIME_SERVER_PORT)) {
      this.logger.critical('validKeys', `Invalid environment variable for REALTIME_SERVER_PORT: ${this.REALTIME_SERVER_PORT}`);
      valid = false;
    }
    if (valid) {
      this.logger.info('validKeys', `Proxy Server Port: ${this.PROXY_PORT}`);
      this.logger.info('validKeys', `Historical Server Hostname: ${this.HISTORICAL_SERVER_HOSTNAME}`);
      this.logger.info('validKeys', `Historical Server Port: ${this.HISTORICAL_SERVER_PORT}`);
      this.logger.info('validKeys', `Realtime Server Hostname: ${this.REALTIME_SERVER_HOSTNAME}`);
      this.logger.info('validKeys', `Realtime Server Port: ${this.REALTIME_SERVER_PORT}`);
    }
    return valid;
  }
}