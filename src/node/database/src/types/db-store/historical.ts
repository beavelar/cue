export interface HistoricalAlert {
  [key: string]: HistoricalContents
}

export interface HistoricalContents {
  alert_date: string,
  ask: number,
  days_to_expiry: number,
  delta: number,
  diff: number,
  expires: string,
  gamma: number,
  highest_ask: number,
  implied_volatility: number,
  open_interest: number,
  option_type: string,
  'p/l': number,
  rho: number,
  strike: number,
  theta: number,
  ticker: string,
  time_of_day: string,
  time_passed: number,
  underlying: number,
  vega: number,
  volume: number,
  'vol/oi': number
}