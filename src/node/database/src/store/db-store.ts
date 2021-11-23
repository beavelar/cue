import { Logger } from '../logging/logger';
import { Schema, model, connect } from 'mongoose';
import { HistoricalAlert, HistoricalContents } from '../types/db-store/historical';
import { createEmptyRatedAlert, RealtimeAlert, RealtimeContentsRated } from '../types/db-store/realtime';

export class DBStore {
  /** Logger for DBStore */
  private readonly logger = new Logger('DBStore');

  /** Schema structure for realtime data points */
  private realtimeSchema = new Schema<RealtimeContentsRated>({
    alert_date: { type: String, required: true },
    ask: { type: { rate: String, value: Number }, required: true },
    days_to_expiry: { type: { rate: String, value: Number }, required: true },
    delta: { type: { rate: String, value: Number }, required: true },
    diff: { type: { rate: String, value: Number }, required: true },
    expires: { type: String, required: true },
    gamma: { type: { rate: String, value: Number }, required: true },
    implied_volatility: { type: { rate: String, value: Number }, required: true },
    open_interest: { type: { rate: String, value: Number }, required: true },
    option_type: { type: String, required: true },
    rho: { type: { rate: String, value: Number }, required: true },
    strike: { type: { rate: String, value: Number }, required: true },
    theta: { type: { rate: String, value: Number }, required: true },
    ticker: { type: String, required: true },
    time_of_day: { type: String, required: true },
    underlying: { type: { rate: String, value: Number }, required: true },
    vega: { type: { rate: String, value: Number }, required: true },
    volume: { type: { rate: String, value: Number }, required: true },
    'vol/oi': { type: { rate: String, value: Number }, required: true }
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
  private RealtimeModel = model<RealtimeContentsRated>('realtime', this.realtimeSchema);

  /** MongoDB model for realtime data points */
  private HistoricalModel = model<HistoricalContents>('historical', this.historicalSchema);

  /** Keys that shouldn't rated as they can't be compared */
  private unratedKeys: Array<string> = new Array<string>();

  constructor(url: string) {
    connect(url);
    this.unratedKeys.push('alert_date');
    this.unratedKeys.push('expires');
    this.unratedKeys.push('option_type');
    this.unratedKeys.push('ticker');
    this.unratedKeys.push('time_of_day');
  }

  public async getAllRealtime(filter?: any, sort?: any): Promise<Array<RealtimeContentsRated>> {
    if (filter && sort) {
      return this.RealtimeModel.find({}, filter).sort(sort);
    }
    else if (filter) {
      return this.RealtimeModel.find({}, filter);
    }
    else {
      return this.RealtimeModel.find();
    }
  }

  public async writeRealtime(realtime: RealtimeAlert): Promise<string> {
    this.logger.log('writeRealtime', `Received realtime write request`);
    const promise = new Promise<string>((resolve, reject) => {
      const ratedAlerts = new Array<RealtimeContentsRated>();
      this.getAllHistorical().then((data) => {
        const sortedHistoricalAlerts = {};

        for (const key of Object.keys(Object.values(realtime)[0])) {
          if (!this.unratedKeys.includes(key)) {
            sortedHistoricalAlerts[key] = data.map((item) => {
              return {
                rate: item.rate,
                value: item[key]
              };
            }).sort((left, right) => { return left.value - right.value });
          }
        }

        for (const alert of Object.values(realtime)) {
          const ratedAlert = createEmptyRatedAlert();
          ratedAlert.alert_date = alert.alert_date;
          ratedAlert.expires = alert.expires;
          ratedAlert.option_type = alert.option_type;
          ratedAlert.ticker = alert.ticker;
          ratedAlert.time_of_day = alert.time_of_day;

          for (const key of Object.keys(alert)) {
            if (!this.unratedKeys.includes(key)) {
              for (let index = 0; index < sortedHistoricalAlerts[key].length - 1; index++) {
                if (sortedHistoricalAlerts[key][index].value <= alert[key]) {
                  const leftDiff = alert[key] - sortedHistoricalAlerts[key][index].value;
                  const rightDiff = sortedHistoricalAlerts[key][index + 1].value - alert[key];

                  if (leftDiff <= rightDiff) {
                    ratedAlert[key] = {
                      rate: sortedHistoricalAlerts[key][index].rate,
                      value: sortedHistoricalAlerts[key][index].value
                    };
                    break;
                  }
                  else {
                    ratedAlert[key] = {
                      rate: sortedHistoricalAlerts[key][index + 1].rate,
                      value: sortedHistoricalAlerts[key][index + 1].value
                    };
                    break;
                  }
                }
              }
              ratedAlerts.push(ratedAlert);
            }
          }
        }

        this.RealtimeModel.insertMany(ratedAlerts).then((onfulfilled) => {
          resolve('Realtime alerts written');
        }).catch((onrejected) => {
          reject(`Failed to write realtime data to database: ${onrejected}`);
        });
      });
    });
    return promise;
  }

  public async getAllHistorical(filter?: any, sort?: any): Promise<Array<HistoricalContents>> {
    if (filter && sort) {
      return this.HistoricalModel.find({}, filter).sort(sort);
    }
    else if (filter) {
      return this.HistoricalModel.find({}, filter);
    }
    else {
      return this.HistoricalModel.find();
    }
  }

  public async writeHistorical(historical: HistoricalAlert): Promise<string> {
    this.logger.log('writeHistorical', `Received historical write request`);
    const promise = new Promise<string>((resolve, reject) => {
      this.HistoricalModel.insertMany(Object.values(historical)).then((onfulfilled) => {
        resolve('Historical alerts written');
      }).catch((onrejected) => {
        reject(`Failed to write historical data to database: ${onrejected}`);
      });
    });
    return promise;
  }
}