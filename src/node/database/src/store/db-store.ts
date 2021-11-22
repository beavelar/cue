import { Logger } from '../logging/logger';
import { Schema, model, connect } from 'mongoose';
import { RealtimeAlert, RealtimeContents } from '../types/db-store/realtime';
import { HistoricalAlert, HistoricalContents } from '../types/db-store/historical';

export class DBStore {
  /** Logger for DBStore */
  private readonly logger = new Logger('DBStore');

  /** Schema structure for realtime data points */
  private realtimeSchema = new Schema<RealtimeContents>({
    alert_date: { type: String, required: true },
    ask: { type: Number, required: true },
    days_to_expiry: { type: Number, required: true },
    delta: { type: Number, required: true },
    diff: { type: Number, required: true },
    expires: { type: String, required: true },
    gamma: { type: Number, required: true },
    implied_volatility: { type: Number, required: true },
    open_interest: { type: Number, required: true },
    option_type: { type: String, required: true },
    rho: { type: Number, required: true },
    strike: { type: Number, required: true },
    theta: { type: Number, required: true },
    ticker: { type: String, required: true },
    time_of_day: { type: String, required: true },
    underlying: { type: Number, required: true },
    vega: { type: Number, required: true },
    volume: { type: Number, required: true },
    'vol/oi': { type: Number, required: true }
  }, { collection: 'realtime' });

  /** Schema structure for historical data points */
  private historicalSchema = new Schema<HistoricalContents>({
    alert_date: { type: String, required: true },
    ask: { type: Number, required: true },
    days_to_expiry: { type: Number, required: true },
    delta: { type: Number, required: true },
    diff: { type: Number, required: true },
    expires: { type: String, required: true },
    gamma: { type: Number, required: true },
    highest_ask: { type: Number, required: true },
    implied_volatility: { type: Number, required: true },
    open_interest: { type: Number, required: true },
    option_type: { type: String, required: true },
    'p/l': { type: Number, required: true },
    rate: { type: String, required: true },
    rho: { type: Number, required: true },
    strike: { type: Number, required: true },
    theta: { type: Number, required: true },
    ticker: { type: String, required: true },
    time_of_day: { type: String, required: true },
    time_passed: { type: Number, required: true },
    underlying: { type: Number, required: true },
    vega: { type: Number, required: true },
    volume: { type: Number, required: true },
    'vol/oi': { type: Number, required: true }
  }, { collection: 'historical' });

  /** MongoDB model for realtime data points */
  private RealtimeModel = model<RealtimeContents>('realtime', this.realtimeSchema);

  /** MongoDB model for realtime data points */
  private HistoricalModel = model<HistoricalContents>('historical', this.historicalSchema);

  constructor(url: string) {
    connect(url);
  }

  public async getAllRealtime(): Promise<Array<RealtimeContents>> {
    const promise = new Promise<Array<RealtimeContents>>((resolve, reject) => {
      this.RealtimeModel.find((err, data) => {
        if (err) {
          reject(`Failed to get all realtime data: ${err}`);
        }
        else {
          resolve(data);
        }
      });
    });
    return promise;
  }

  public async writeRealtime(realtime: RealtimeAlert): Promise<string> {
    this.logger.log('writeRealtime', `Received realtime write request`);
    const promise = new Promise<string>((resolve, reject) => {
      this.RealtimeModel.insertMany(Object.values(realtime)).then((onfulfilled) => {
        resolve('Realtime alerts written');
      }).catch((onrejected) => {
        reject(`Failed to write data to database: ${onrejected}`);
      });
    });
    return promise;
  }

  public async getAllHistorical(): Promise<Array<HistoricalContents>> {
    const promise = new Promise<Array<HistoricalContents>>((resolve, reject) => {
      this.HistoricalModel.find((err, data) => {
        if (err) {
          reject(`Failed to get all historical data: ${err}`);
        }
        else {
          resolve(data);
        }
      });
    });
    return promise;
  }

  public async writeHistorical(historical: HistoricalAlert): Promise<string> {
    this.logger.log('writeHistorical', `Received historical write request`);
    const promise = new Promise<string>((resolve, reject) => {
      this.HistoricalModel.insertMany(Object.values(historical)).then((onfulfilled) => {
        resolve('Historical alerts written');
      }).catch((onrejected) => {
        reject(`Failed to write data to database: ${onrejected}`);
      });
    });
    return promise;
  }
}