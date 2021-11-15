export interface RealtimeAlert {
  [key: string]: RealtimeContents
}

export interface RealtimeContents {
  alert_date: string,
  ask: number,
  days_to_expiry: number,
  delta: number,
  diff: number,
  expires: string,
  gamma: number,
  implied_volatility: number,
  open_interest: number,
  option_type: string,
  rho: number,
  strike: number,
  theta: number,
  ticker: string,
  time_of_day: string,
  underlying: number,
  vega: number,
  volume: number,
  'vol/oi': number
}