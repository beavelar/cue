/**
 * Interface which will encapsulate the incoming historical alerts that will be
 * saved onto the database.
 */
export interface HistoricalAlerts {
  [key: string]: HistoricalAlert
}

/**
 * Interface which will encapsulate the incoming historical alert that will be
 * saved onto the database.
 */
export interface HistoricalAlert {
  /** The date the alert was raised in seconds. */
  alert_date: number;
  /** The ask price of the option at the time of the alert. */
  ask: number;
  /** The number of days between the alert date and the expiry date. */
  days_to_expiry: number;
  /** The option delta value. */
  delta: number;
  /** The difference between the strike price and the underlying value. */
  diff: number;
  /** The expiry date of the option in seconds. */
  expires: number;
  /** The option gamma value. */
  gamma: number;
  /** The highest price the option reached in it's lifetime. */
  highest_ask: number;
  /** The option implied volatility value. */
  implied_volatility: number;
  /** The option open interest value. */
  open_interest: number;
  /** The option type (Call/Put). */
  option_type: string;
  /** The P/L ratio of the option based on it's highest ask. */
  'p/l': number;
  /** The rating of the alert (BAD/OKAY/GOOD/BEST). */
  rate: string;
  /** The option rho value. */
  rho: number;
  /** The strike price of the option. */
  strike: number;
  /** The option theta value. */
  theta: number;
  /** The ticker of the option. */
  ticker: string;
  /** The time of day that the alert was raised in seconds. */
  time_of_day: number;
  /** The number of days between the alert date and the date the option reached
   * the highest ask. */
  time_passed: number;
  /** The underlying value at the time the alert was raised. */
  underlying: number;
  /** The option vega value. */
  vega: number;
  /** The volume of the option at the time the alert was raised. */
  volume: number;
  /** The calculation of volume/open interest. */
  'vol/oi': number
}