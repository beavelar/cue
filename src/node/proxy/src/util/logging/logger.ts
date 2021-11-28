/**
 * The interface which will be responsible for the application logging
 */
export class Logger {
  constructor(private readonly filename: string) { }

  /**
   * Debug level log implementation.
   * 
   * @param funcName The name of the function utilizing the method 
   * @param message The desired message to log
   */
  public debug(funcName: string, message: string): void {
    const date = this.formatDate(new Date());
    console.log(`DEBUG: ${date} - ${this.filename}.${funcName} - ${message}`);
  }

  /**
   * Info level log implementation.
   * 
   * @param funcName The name of the function utilizing the method 
   * @param message The desired message to log
   */
  public info(funcName: string, message: string): void {
    const date = this.formatDate(new Date());
    console.log(`INFO: ${date} - ${this.filename}.${funcName} - ${message}`);
  }

  /**
   * Warning level log implementation.
   * 
   * @param funcName The name of the function utilizing the method 
   * @param message The desired message to log
   * @param error The error to display after the message
   */
  public warning(funcName: string, message: string, error?: any): void {
    const date = this.formatDate(new Date());
    console.log(`WARNING: ${date} - ${this.filename}.${funcName} - ${message}`);
    if (error) {
      console.error(error);
    }
  }

  /**
   * Critical level log implementation.
   * 
   * @param funcName The name of the function utilizing the method 
   * @param message The desired message to log
   * @param error The error to display after the message
   */
  public critical(funcName: string, message: string, error?: any): void {
    const date = this.formatDate(new Date());
    console.error(`ERROR: ${date} - ${this.filename}.${funcName} - ${message}`);
    if (error) {
      console.error(error);
    }
  }

  /**
   * Helper function to format the date displayed in the log line
   * 
   * @param date The date of the log
   * @returns The date as a string in YYYY-MM-DD hh:mm:ss form
   */
  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1 < 10 ? `0${date.getUTCMonth() + 1}` : date.getUTCMonth() + 1;
    const day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
    const hour = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
    const minute = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();
    const second = date.getUTCSeconds() < 10 ? `0${date.getUTCSeconds()}` : date.getUTCSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}