import { Logger } from '../logging/logger';

export class Environment {
  public readonly logger: Logger = new Logger('env');
  public readonly PROXY_PORT: number;
  public readonly HISTORICAL_SERVER_HOSTNAME: string;
  public readonly HISTORICAL_SERVER_PORT: number;
  public readonly REALTIME_SERVER_HOSTNAME: string;
  public readonly REALTIME_SERVER_PORT: number;

  constructor() {
    this.PROXY_PORT = parseInt(process.env.PROXY_PORT);
    this.HISTORICAL_SERVER_HOSTNAME = process.env.HISTORICAL_SERVER_HOSTNAME;
    this.HISTORICAL_SERVER_PORT = parseInt(process.env.HISTORICAL_SERVER_PORT);
    this.REALTIME_SERVER_HOSTNAME = process.env.REALTIME_SERVER_HOSTNAME;
    this.REALTIME_SERVER_PORT = parseInt(process.env.REALTIME_SERVER_PORT);
  }

  public validKeys(): boolean {
    if (isNaN(this.PROXY_PORT)) {
      this.logger.error('validKeys', `Invalid environment variable for PROXY_PORT: ${this.PROXY_PORT}`);
      return false;
    }
    else if (!this.HISTORICAL_SERVER_HOSTNAME) {
      this.logger.error('validKeys', `Invalid environment variable for HISTORICAL_SERVER_HOSTNAME: ${this.HISTORICAL_SERVER_HOSTNAME}`);
      return false;
    }
    else if (isNaN(this.HISTORICAL_SERVER_PORT)) {
      this.logger.error('validKeys', `Invalid environment variable for HISTORICAL_SERVER_PORT: ${this.HISTORICAL_SERVER_PORT}`);
      return false;
    }
    else if (!this.REALTIME_SERVER_HOSTNAME) {
      this.logger.error('validKeys', `Invalid environment variable for REALTIME_SERVER_HOSTNAME: ${this.REALTIME_SERVER_HOSTNAME}`);
      return false;
    }
    else if (isNaN(this.REALTIME_SERVER_PORT)) {
      this.logger.error('validKeys', `Invalid environment variable for REALTIME_SERVER_PORT: ${this.REALTIME_SERVER_PORT}`);
      return false;
    }
    return true;
  }
}