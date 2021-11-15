export class Logger {
  constructor(private readonly filename: string) {}

  public debug(funcName: string, message: string): void {
    const date = this.formatDate(new Date());
    console.log(`DEBUG: ${date} - ${this.filename}.${funcName} - ${message}`);
  }

  public log(funcName: string, message: string): void {
    const date = this.formatDate(new Date());
    console.log(`LOG: ${date} - ${this.filename}.${funcName} - ${message}`);
  }

  public warning(funcName: string, message: string): void {
    const date = this.formatDate(new Date());
    console.log(`WARNING: ${date} - ${this.filename}.${funcName} - ${message}`);
  }

  public error(funcName: string, message: string, error?: any): void {
    const date = this.formatDate(new Date());
    console.error(`ERROR: ${date} - ${this.filename}.${funcName} - ${message}`);
    if (error) {
      console.error(error);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth()+1 < 10 ? `0${date.getUTCMonth()+1}` : date.getUTCMonth()+1;
    const day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
    const hour = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
    const minute = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();
    const second = date.getUTCSeconds() < 10 ? `0${date.getUTCSeconds()}` : date.getUTCSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}